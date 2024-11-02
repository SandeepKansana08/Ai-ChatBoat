let prompt=document.querySelector("#prompt");
let chatContainer=document.querySelector(".chat-container");
let imagebtn=document.querySelector("#image");
let image=document.querySelector("#image img");
let imageInput=document.querySelector("#image input");
let submitBtn=document.querySelector("#submit");

const apiUrl="https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyDPJ7W-sPK-jOYHyLpjY2JnW9zpbniPWy8"

let user={
    data:null,
    file:{
        mime_type:null,
        data:null
    }
}

async function getResponse(aiChatBox) {
    let text=aiChatBox.querySelector(".ai-chat-area");

    let RequestOption={
      method:'POST',
      headers:{'Content-Type': 'application/json'},
      body:JSON.stringify({
       "contents": [
    {
                "parts": [
                 { "text": user.data },
                  ...(user.file.data ? [{ "inline_data": user.file }] : [])
                 ]
                }
            ]

      }) 
    }
try {
    let response=await fetch(apiUrl,RequestOption) 
    let data=await response.json();
   
   let apiResponse= data.candidates[0].content.parts[0].text;
   text.textContent=apiResponse;
   
     
} catch (error) {
        text.textContent = "Failed to fetch response. Please try again.";
}
    finally{
        chatContainer.scrollTo({top:chatContainer.scrollHeight, behavior:"smooth"})
        image.src="images/img.svg" 
        image.classList.remove("choose")
        user.file={}
    }
    
}

function createChatBox(html,classes){
    let div=document.createElement("div");
    div.innerHTML=html;
    div.classList.add(classes);
    return div;
}


function handleChatResponse(message){
    user.data=message;
    let html=`<img src="images/user-for-Ai.png" alt="" id="user-image" width="5%">
            <div class="user-chat-area">
            ${message}
            ${user.file.data ? `<img src="data:${user.file.mime_type};base64,${user.file.data}" class="chooseimg"/>` : ""}
            </div>`
            prompt.value="";
            let userChatBox= createChatBox(html,"user-chat-box");
            chatContainer.appendChild(userChatBox);
            chatContainer.scrollTo({top:chatContainer.scrollHeight, behavior:"smooth"})

    setTimeout(()=>{
        let html=`<img src="images/Ai-chat.png" alt="" id="ai-image" width="8%">
            <div class="ai-chat-area">
             <img src="images/load-32_256.gif" alt="" class="load" width="5%">   
        </div>`
        let aiChatBox= createChatBox(html,"ai-chat-box");
        chatContainer.appendChild(aiChatBox);
        getResponse(aiChatBox);
    },600)
}


prompt.addEventListener("keydown",(e)=>{
    if(e.key == "Enter"){
        handleChatResponse(prompt.value);
    }
});

imageInput.addEventListener("change",()=>{
    const file=imageInput.files[0];
    if(!file) return;
    let reader=new FileReader()
    reader.onload=(e)=>{
        let base64String=e.target.result.split(",")[1]
        user.file={
            mime_type:file.type,
            data: base64String
        } 
        image.src= `data:${user.file.mime_type};base64,${user.file.data}` 
        image.classList.add("choose") 
    }
    reader.readAsDataURL(file)
})

imagebtn.addEventListener("click",()=>{
    imagebtn.querySelector("input").click()
});

submitBtn.addEventListener("click",()=>{
    handleChatResponse(prompt.value)
});

