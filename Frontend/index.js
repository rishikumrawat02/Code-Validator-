const testButton = document.getElementById('testButton');
const htmlCode = document.getElementById('htmlCode');
const cssCode = document.getElementById('cssCode');
const output = document.getElementById('output');


testButton.addEventListener('click', async function () {
    const html = htmlCode.value;
    const css = cssCode.value;
    try {
        const response = await axios.post('http://localhost:3000/validate', { html, css });
        if (response.status == 200) {
            const responseHtml = response.data.message;
            output.innerHTML = responseHtml;
        } else {
            alert("Something went wrong! Pleas try again");
            console.log(response);
        }
    } catch (error) {
        alert("Something went wrong! Pleas try again");
        console.error(error);
    }
})