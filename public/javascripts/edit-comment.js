import {convertTime} from './utils.js'
let editText = document.querySelectorAll(".comment-edit");
editText.forEach(e => {e.addEventListener("click",(e) => {editEle(e)})})

async function editEle(e){
    try {
        let commentId = e.target.parentElement.previousSibling.value;
        let commentDiv = e.target.parentElement.previousSibling.parentElement;
        let commentText = e.target.parentElement.nextSibling;
        let updateDiv = document.createElement('div');
        let updateText = document.createElement('textarea');
        let updateButton = document.createElement('button');
        let cancelButton = document.createElement('button');
        updateText.setAttribute('class', 'edit-comment-text-box')
        updateText.value = commentText.innerText;
        updateText.addEventListener('keydown', (e) => {console.log(e.key);if (e.key === 'Enter'){updateFromEnter(e)}})
        updateButton.innerText = "Submit"
        updateButton.addEventListener('click', (e) => {updateFromButton(e)})
        cancelButton.setAttribute('value', 'Back');
        cancelButton.innerText = "Back"
        cancelButton.addEventListener('click', e => {updateDiv.parentElement.replaceChild(commentText, updateDiv)})
        updateDiv.append(updateText, updateButton, cancelButton)
        function updateFromButton(e){update(e.target.previousSibling.value)}
        function updateFromEnter(e){update(e.target.value)}
        async function update(comment){
            let body = {comment}
            const res = await fetch(`/comments/${commentId}`, {
                method: "Put",
                body: JSON.stringify(body),
                headers: {
                    "Content-Type": "application/json",
                },
            });
            let {newCommentText, date} = await res.json()

            commentText.innerText = newCommentText;
            updateDiv.parentElement.replaceChild(commentText, updateDiv);
            date = new Date(date);
            let month = convertTime(date.getMonth(), 'month');
            let year = convertTime(date.getYear(), 'year');
            let day = convertTime(date.getDate(), 'date');
            let hour = convertTime(date.getHours(), 'hours');
            let minutes = convertTime(date.getMinutes(), 'minutes');
            let format = convertTime(date.getHours(), 'format');
            console.log(commentDiv.lastChild.innerText)
            commentDiv.lastChild.innerText = `${month}, ${day}, ${year}, ${hour}:${minutes} ${format}`;
        }


        // if (!res.ok){throw (res)}
        commentText.parentElement.replaceChild(updateDiv, commentText)
    } catch (error) {
        console.log(error)
        return
    }
}

export {editEle}
