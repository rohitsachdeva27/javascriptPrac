let comments=[];
let commentList=document.getElementById("commentsList");  // Div id where we will append our comments 
let text=document.getElementById("commentBox");  // input id of the comment box

// function to submit entered comment
submitComment=function(){    
   pushComment();   
 }


pushComment=function()
{   
    comments.push(
        {
            parentId:null,
            id:Math.random().toString().substr(2,7),
            commentText:text.value,
            childComments:[],
            likes:0,
        className:''})
    text.value="";  
    createComment(comments)      ;
}

// this function will generate the html for comments div 
generateCommentHtml=function(obj)
{   
    let fullView='';             
    for(let comm of obj )
 {           
    fullView+=`
    <div class='${comm.className}' data-parent='${comm.parentId}' id='${comm.id}'>${comm.commentText}&nbsp;&nbsp;&nbsp;
    <a href='#' onClick='likeComment(${comm.id})'>Likes</a><span style="border-radius:20%;">${comm.likes==0?" ":comm.likes}</span>
    <a href='#' onClick='deleteComment(${comm.id})'>Delete</a>
    <a href='#'>Edit</a>
    <a href='#'>Reply</a>
    </div>`;   
    if(comm.childComments.length>0)       
    {
        fullView+=generateCommentHtml(comm.childComments,0)        
    }
 }
 return fullView;
}

// generated html will be appened to the commentlist div.
createComment=function(view)
{    
    let generatedView=generateCommentHtml(view);    
    commentList.innerHTML=generatedView;
}

// like functionality
likeComment=function(id,comm=comments,)
{
    for(let obj of comm)
    {
        if(obj.id==id)
        {
            obj.likes+=1;
        }
        else if(obj.childComments.length>0){
            likeComment(id,obj.childComments)
        }
    } 
   createComment(comments);
}
/**
 * when user will click on reply button : then we have associated the click event on div which will 
 * catch the event target through which we will generate the html 
 * and associate the parent id to the replied comment
 */
let pid;
let data;
commentList.addEventListener('click',(e)=>{
    if(e.target.innerText=='Reply')
    {
        e.target.style.display="none"; // this is done so when user will click on reply for that time button should be not there
        pid=!e.target.parentNode.getAttribute("data-parent")?e.target.parentNode.getAttribute("data-parent"):e.target.parentNode.getAttribute("id")
        const parentNod=e.target.parentNode;
        parentNod.appendChild(generateReply(pid))        
    }
    if(e.target.innerText=='Add Comment')
    {            
        const  parentId=e.target.parentNode.getAttribute("data-parent")?e.target.parentNode.getAttribute("data-parent"):e.target.parentNode.getAttribute("id");
        const newAddedComment={
            parentId:parentId,
            id:Math.random().toString().substr(2,7),
            commentText:e.target.parentNode.firstChild.value,
            childComments:[],
            likes:0,
            className:'chat-bubble'
        };    

        addNewChildComment(comments,newAddedComment);    
    }
    if(e.target.innerText=='Edit')                
    {
        pid=!e.target.parentNode.getAttribute("data-parent")?e.target.parentNode.getAttribute("data-parent"):e.target.parentNode.getAttribute("id");
        data=getComment(pid,comments);
        let div=document.createElement('div');   
        div.setAttribute("data-parent",pid);        
        div.innerHTML=`<input type='text' value='${data.commentText}'>
        <a href='#'>update comment</a>`
        e.target.parentNode.appendChild(div);        
    }
    if(e.target.innerText=='update comment')
    {
    pid=e.target.parentNode.getAttribute("data-parent")?e.target.parentNode.getAttribute("data-parent"):e.target.parentNode.getAttribute("id");
    const val=e.target.parentNode.firstChild.value;
    setComment(pid,val);
    createComment(comments)
    }
    if(e.target.innerText=='Delete')
    {
        const parentId=e.target.parentNode.getAttribute("id");
        deleteComment(parentId,comments);
        createComment(comments);
    }
})

let deleteComment = (pid,comments) => {
	for (let i in comments) {
		if (comments[i].id === pid) {
			comments.splice(i, 1);
		} else if (comments[i].childComments.length > 0) {
			deleteComment(pid,comments[i].childComments);
		}
	}
};

getComment=function(pid,comm)
{    
for(i=0;i<comm.length;i++)
{
    if(comm[i].id==pid){            
        return comm[i];
    }
    else if(comm[i].childComments.length>0)
        return getComment(pid,comm[i].childComments)
}
}

setComment=function(pid,val,comm=comments)
{
    for(let c of comm)
    {
    if(c.id==pid)
    {
        c.commentText=val
    }
    else if(c.childComments.length>0)
    {
        setComment(pid,val,c.childComments)
    }
}   
}

addNewChildComment=function(comment,childCom)
{
    for(let com of comment)
    {
    if(com.id==childCom.parentId)
    {
    com.childComments.push(childCom);
    }    
    else if(com.childComments.length>0)
    {
        addNewChildComment(com.childComments,childCom)
    }
}
createComment(comments)    
}
    
 generateReply=function(id)
    {
        let div=document.createElement('div');  
        div.setAttribute("data-parent",id);  
        div.innerHTML=`<input type='text'>
        <a href='#'>Add Comment</a>`
        return div;
    }
   





