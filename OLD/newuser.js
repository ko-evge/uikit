//=================================================================================================
//  NEW USER
//=================================================================================================
function newuser_close() {
   UserPanel.setStyle("display", "none");  
   AcLabel1.setStyle("display", "none");  
   AcLabel2.setStyle("display", "none");  
   AcLabel3.setStyle("display", "none");  
   AcLabel4.setStyle("display", "none");  
   AcInput1.setStyle("display", "none");  
   AcInput2.setStyle("display", "none");  
   AcCombo1.setStyle("display", "none");  
   AcButton1.setStyle("display", "none");  
   AcButton2.setStyle("display", "none"); 
   user_panel.flag=true;
   return true;
}
//=================================================================================================
//                                    
//=================================================================================================
function newuser_open() {
   UserPanel.setStyle("display", "block");  
   AcLabel1.setStyle("display", "block");  
   AcLabel2.setStyle("display", "block");  
   AcLabel3.setStyle("display", "block");  
   AcLabel4.setStyle("display", "block");  
   AcInput1.setStyle("display", "block");  
   AcInput2.setStyle("display", "block");  
   AcCombo1.setStyle("display", "block");  
   AcButton1.setStyle("display", "block");  
   AcButton2.setStyle("display", "block");  
   ac_input1.setControlText("");
   ac_input2.setControlText("");
   user_panel.flag=true;
   ac_input1.element().focus();
   return true;
} 
//=================================================================================================
//  
//=================================================================================================
                             var user_obj = AW.HTML.SPAN.subclass();  
                             user_obj.create = function(){  
                                  var obj = this.prototype;  
                                  var _super = this.superclass.prototype;  
      
                                  obj.init = function(argument){  
                                       _super.init.call(this);  
         
                                       obj.setStyle("position", "absolute"); 
                                       obj.setStyle("moz-user-focus","normal"); 
           
                                       obj.setStyle("background", "#bbbbbb"); 
                                       obj.setStyle("z-index", "10"); 
    
                                       var workarea = new AW.HTML.DIV;  
                                       workarea.setContent("text", argument.toString());  
  
                                       obj.setContent("html",  workarea);         
                                  }  
                             }  

                             var user_panel = new AW.UI.Group;
                             user_panel.setId("user_panel");
                             var UserPanel = new user_obj(user_panel); 
                             UserPanel.setStyle("display", "none") ;    
                             document.write(UserPanel); 
user_panel.flag=true;
                             var ac_label1 = new AW.UI.Label;
                             ac_label1.setId("ac_label1");
                             ac_label1.setControlText("Enter user name and pasword.");
                             ac_label1.setControlImage([""]);
                             var AcLabel1 = new user_obj(ac_label1);
                             AcLabel1.setStyle("display", "none") ;    
                             document.write(AcLabel1); 

                             var ac_label2 = new AW.UI.Label;
                             ac_label2.setId("ac_label2");
                             ac_label2.setControlText("Password:");
                             ac_label2.setControlImage("");
                             var AcLabel2 = new user_obj(ac_label2);
                             AcLabel2.setStyle("display", "none") ;    
                             document.write(AcLabel2); 

                             var ac_label3 = new AW.UI.Label;
                             ac_label3.setId("ac_label3");
                             ac_label3.setControlText("User Name:");
                             var AcLabel3 = new user_obj(ac_label3);
                             AcLabel3.setStyle("display", "none") ;    
                             document.write(AcLabel3); 

                             var ac_label4 = new AW.UI.Label;
                             ac_label4.setId("ac_label4");
                             ac_label4.setControlText("Language:");
                             var AcLabel4 = new user_obj(ac_label4);
                             AcLabel4.setStyle("display", "none") ;    
                             document.write(AcLabel4); 

                             var ac_input1 = new AW.UI.Input;
                             ac_input1.setId("ac_input1");
                             ac_input1.setControlText("");
                             ac_input1.onKeyEnter = function(event){ ac_input2.element().focus();  return true; };
                             var AcInput1 = new user_obj(ac_input1);
                             AcInput1.setStyle("display", "none") ;    
                             document.write(AcInput1); 

  
                             var ac_input2 = new AW.UI.Input;
                             ac_input2.setId("ac_input2");
                             ac_input2.setControlText("");
                             ac_input2.onKeyEnter = function(event){ ac_combo1.element().focus();  return true; };
                             var AcInput2 = new user_obj(ac_input2);
                             AcInput2.setStyle("display", "none") ;    
                             document.write(AcInput2); 
                                                      
                             var ac_combo1 = new AW.UI.Combo;
                             ac_combo1.setId("ac_combo1");
                             ac_combo1.setControlText("First");
                             ac_combo1.setItemText(["First", "Second"]);
                             ac_combo1.setItemCount(2);
                             ac_combo1.onKeyEnter = function(event){ ac_button1.element().focus();  return true; };
                             var AcCombo1 = new user_obj(ac_combo1);
                             AcCombo1.setStyle("display", "none") ;    
                             document.write(AcCombo1); 

                             var ac_button1 = new AW.UI.Button;
                             ac_button1.setId("ac_button1");
                             ac_button1.setControlText("Enter");
                             var AcButton1 = new user_obj(ac_button1);
                             AcButton1.setStyle("display", "none") ;    
                             document.write(AcButton1); 

                             var ac_button2 = new AW.UI.Button;
                             ac_button2.setId("ac_button2");
                             ac_button2.setControlText("Cancel");
                             var AcButton2 = new user_obj(ac_button2);
                             AcButton2.setStyle("display", "none") ;    
                             document.write(AcButton2); 

//---------------------------------------------
//  new user
//---------------------------------------------
ac_button1.onClick = function() {
	   var user_r = [];
       var arm_r = [];
       user_r = pipe.event({action:'get_us',user: ac_input1.getControlText(), pass: ac_input2.getControlText()} ,true);
       if (user_r[0]>0) {
          cbox.kdus=user_r[0];
          ac_input1.kodp=user_r[0];
          arm_r = pipe.event({action:'get_arm' } ,true);
          // time work ??????
        
          // visible fo user ?????
        
           newuser_close();
           wmain_open();
       };
       ac_input1.setControlText("");
       ac_input2.setControlText("");
};
//---------------------------------------------
//  cancel
//---------------------------------------------
ac_button2.onClick = function(){
   ac_input1.kodp=0;
   var kodp = 0;
   var user_r = [];
   var arm_r = [];
   //wmain_close();
   newuser_close();
   bt_access.setStyle("display", "block"); 
};
//-----------------------------------------------------------------------------
//  END
//-----------------------------------------------------------------------------
