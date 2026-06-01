// beatiful hack to make code crossbrowser.
if (typeof ActiveXObject != 'undefined') XMLHttpRequest=ActiveXObject;

function JSTCP (server) {
    return {

        srv : (typeof server == 'undefined')? '/' : server,          // server path or root
    
        framelength:5,      
        
        // max packets collected per frame ,
        // 1 = no real framing as every packet gets its own frame.
        // 0 = send single packet whithout frame relay
    
        frametime:3000,      // max time(ms) frame waits for new events if frame length is exided - frame will be send immideatly.
    
        //  private ------------------------
    
        queue:[],                       // events queue
        sheduledsync:false,
        responders: {},
        straemlead: new Date(),
        lasttransport:false,
        framedrop:true,
    
        transport : function(sync,type){

            var transport = new XMLHttpRequest("microsoft.XMLHTTP");
            this.queue[this.queue.length+1] 
    

            transport.open('POST', this.srv,(sync===null)?true:!sync);
            transport.setRequestHeader("User-Agent", "JSTCP v0.1");
            transport.setRequestHeader("JSTCP_PACKET", 'COMPOSITE');
            
 
            /*
            dont try to understand following code
            
            i will make transports selfdestructible
            because transport keeps a reference(real reference not "this." bullshit)
            and passes that reference to the JSTCP core when it chages its state.
            reference is kept inside function "onreadystatechange" as a parameter
            and not accesible from inside of transport object;
            
            so generally transports are ctreated and 
            freed to the "deep waters of memory" and JSTCP doesnt keep any refs to 
            created transports.
            and transports themself contact JSTCP when needed.
            an then JSTCP kills them when they are done.
            
            and it also keeps a chains of pransports if they are allowed.
            
            */
            
            transport.onreadystatechange = function(object,method,transport,id) {
                return function(abort) {
                    return method.apply(object,[transport,id]);
                };
            }(this,this.onStateChange,transport,this.queue.length);
    
            //transport.onreadystatechange();
            return transport;
        } ,
    
        ROM : function(base, branch) {
            if (!branch || !branch.childNodes || !branch.childNodes.length)
            return;
    
            for (i in branch.childNodes) {
                var element = branch.childNodes[i];
                var type = typeof element;
    
                if (element && type != 'function' && element.nodeType != 3) {
                    if (element.id) {
                        if (base.id)
                        element.fullid=(base.fullid||base.id)+'.'+element.id;
                        else
                        element.fullid=element.id;
    
                        if (element != base[element.id])
                        base[element.id]=element;
    
                        if (element.childNodes)
                        this.ROM(element, element);
                    } else if (element.childNodes)
                    this.ROM(base, element);
                }
            }
        }
        ,
    
        ROM_dbg : function(base, branch) {
            if (!branch.childNodes || !branch.childNodes.length)
            return;
    
            for (i in branch.childNodes) {
                var element = branch.childNodes[i];
                var type = typeof element;
    
                if (type != 'function' && element.nodeType != 3) {
                    if (element.id) {
                        alert('link ' + element.id + ' to ' + base);
                        base[element.id] = element;
                        if (element.childNodes)
                        this.ROM_dbg(element,element);
                    } else if (element.childNodes)
                    this.ROM_dbg(base,element);
    
                    if (element.id && base.id)
                    element.fullid = base.id + '.' + element.id;
                }
            }
        },
        Events : ['Uninitialized', 'Loading', 'Loaded', 'Interactive', 'Complete'],
        ROM_write: function(packet, body) {
            //    alert('write '+ body);
            var mode = (packet.mode) ? packet.mode : 'w';
            var li = packet.target.lastIndexOf('.');
            if (li >= 0) {
                var basestr = packet.target.substring(0, li);
                var base = eval(basestr);
                if (base == undefined)
                alert('Error: ['+basestr+'] undefined');
                var target = packet.target.substring((li+1), packet.target.length);
                if (mode=='w') {
                    if (target == 'innerHTML' && base._romchilds)
                    for (i in base._romchilds) {
                        if ($B('ie'))
                        base[base._romchilds[i]] = null;
                        else
                        delete base[base._romchilds[i]];
                        delete base._romchilds[i];
                        base._romchilds = new Array();
                    }
                    base[target] = body;
                } else if (mode == 'a')
                base[target] += body;
    
                this.ROM(base,base);
            }
        },
    
        __construct: function(server, responders) {
    
            this.lastevent = false;
            //this.responders = (responders || {});
        },
    
        getter: function(base, values) {
    
            var value;
            var results = [];
            for (i in values) {
                value = values[i];
    
                if (value == null)
                results[i] = base[i].valueOf();
                else
                switch (typeof value) {
                    case 'array':
                    case 'object':
                    if (base[i])
                    results[i] = this.getter(base[i], value);
                    break;
                    case 'string':
                    case 'boolean':
                    case 'number':
                    break;
                    default:
                    alert('Unknown type ' + typeof value);
                }
            }
            return results;
        },
    
        setter: function(base, values) {
    
            var value;
            for (i in values) {
                value = values[i];
                if (!base[i])
                base[i] = value;
                else
                if (value == null) {
                    base[i] = value;
                }
                else
                switch (typeof value) {
                    case 'array':
                    case 'object':
                    var link = base[i];
                    this.setter(link, value);
                    break;
                    case 'string':
                    case 'boolean':
                    case 'number':
                    base[i] = value;
                    break;
                    default:
                    alert('Unknown type ' + typeof value);
                }
            }
        },
    
        serialize: function(something) {
            if (typeof something == 'undefined'||typeof something == 'function'|| something == null)
            return 'N;';
    
            switch (typeof something){
                case 'array':
                case 'object':
                var l = 0;
                var str = '';
                for (i in something) {
                    if (isNaN(i))
                    str+='s:'+i.length+':"'+i.toString()+'";'+this.serialize(something[i]);
                    else
                    str+='i:'+parseInt(i)+';'+this.serialize(something[i]);
                    l++;
                }
                return 'a:'+l+':{'+str+'}';
                case 'string':
                var l = something.length;
                var nl = l;
                // utf-8 support for string length
                for (i = 0; i < l; i++) {
                    if (something.charCodeAt(i) > 127) {
                        nl++;
                        if (something.charCodeAt(i) > 2047) {
                            nl++;
                            if (something.charCodeAt(i) > 65535)
                            nl++;
                        }
                    }
                }
                return 's:'+nl+':"'+something.toString()+'";';
                case 'boolean':
                return ((something) ? 'b:1':'b:0')+';';
                case 'number':
                if (isNaN(something) || !isFinite(something))
                return 'N;';
                if (parseInt(something) == parseFloat(something))
                return 'i:'+something.toString()+';';
                else
                // IE can't handle more than 20, let it burn in hell for that!
                return 'd:'+something.toFixed(20).toString()+'0000000000000000000000;';
                default:
                alert('Unknown type ' + typeof something);
            }
        },
    
        resend: function() {
            if (this.lastevent)
            this.event(this.lastevent);
        },
        /*
        sync:
        true - syncronous packet
        false - asyncronous
        null - asyncronous and even droppable;
    
    
        */
        event: function(eventpacket, sync) {
    
            this.lastevent = eventpacket;
            // we can't drop next frame if it contains a one not dropable event;
            if (sync!==null) this.framedrop=false;
            sync = (typeof sync == 'undefined' ) ? false : sync  ;
    
            // direct sending when queue support is disabled
            if (this.framelength==0) {
                var transport = this.transport(sync);
                transport.send(this.serialize(eventpacket));
                if (sync) return this.processMesage(transport);
                return;
            }
    
    
            this.queue.push(eventpacket);
    
            if (this.queue.length>=this.framelength || sync) {
                return this.sendqueue(sync);
            } else if (!this.sheduledsync) {
                var JSTCP = this;// get the pointer
                this.sheduledsync = setTimeout(function(){ JSTCP.sendqueue() },this.frametime);
            }
        },
    
        sendqueue: function (sync) {
            clearTimeout(this.sheduledsync);
            this.sheduledsync=false;
    
            if (this.queue.length==0) { alert('timing error');return; }
    
            eventpacket  = {
                frame:this.queue,
                type:'frame',
                mode:(this.sheduledsync)?'sheduled':'full',
                actuality:new Date()
            }
   
            var transport = this.transport(sync);

            transport.send(this.serialize(eventpacket));
   
            for (i in this.queue) delete this.queue[i];
            this.queue=[];
            
            if (sync) return this.processMesage(transport);
            return;
            
        },
    
        onStateChange: function(transport,previous,abort) {
            if ( transport.readyState > 1 ) this.respondToReadyState(transport,previous,abort);
            if (transport.readyState == 1 && abort) this.abortarium(transport,previous);
        },
        abortarium: function(transport,previous){
            
            alert('!');
        },
        defaultResponder: function(transport) {},
    
        respondToReadyState: function(transport,previous,abort) {
            
/*            if (abort) {
                //previous.onreadystatechange=function(){};
                alert('aborting');
                transport.abort();
                delete transport;
                //delete previous;
                //return;
            }
*/            
            var rs = transport.readyState;
    
            if (this.Events[rs] == 'Complete') {    // done?
                
                //alert(transport.status);
                if (transport.status == 200) {       // done with no errors? =)                    
                    this.processMesage(transport);
                    
                }
    
    
    
    
                (this.responders['on' + this.Events[rs]]
                || this.responders['onChange'] || this.defaultResponder)(transport);
    
             //->>>>
                delete transport;
    
                return;
            }
    
            (this.responders['onChange'] || this.defaultResponder)(transport);
        },
    
        processMesage:function(transport){
            var messages = transport.responseText.split(transport.getResponseHeader("JSTCP_PACKET"));
            var header;
    
            var ml = (messages.length);
    
            for (mi = 0; mi < ml; mi++) {
                try {
    
    
                    if (header = eval('m='+messages[mi]+';')) {
    
                        switch(header.type.toUpperCase())
                        {
                            case 'RETURN':
                            var returnvalue = eval('m='+messages[++mi]);
                            break
                            case 'WRITE':
                            this.ROM_write(header,messages[++mi]);
                            break
                            case 'SET':
                            this.setter(window, eval('m='+messages[++mi]));
                            break
                            case 'GET':
                            header.event.get = this.getter(window, eval('m='+messages[++mi]));
                            this.event(header.event);
                            break
                            case 'EVAL':
                            eval(messages[++mi]);
                            break
                            default:
    
                        };
    
                    } else
                    alert('ACHTUNG2!!1 ' +messages[mi]);
                } catch (e) {
                    document.body.innerHTML+=messages[mi];
                    //alert("JSTCP ERROR\n"+e.message + "\n" + messages[mi].length );
                }
            }
    
            if (typeof returnvalue!= 'undefined') {
                return returnvalue;
            }
        }
        ,
        loadHTML: function(url) {
            var transport = Browser.features.XmlHttpRequest();
            transport.open('GET', url+'?rnd='+Math.random(), false);
            transport.setRequestHeader("User-Agent", "JSTCP v0.1");
            transport.send(''); // DO NOT REMOVE  ->> '' <<--
            return transport.responseText;
        }
    }
}


