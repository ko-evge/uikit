async function swapi(action, args) {

    const rawResponse = await fetch('/swapi.php', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify([action, args])
    });

    const content = await rawResponse.json();

    return content;
}