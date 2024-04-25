interface Feedback {
    id: number;
    name: string;
    score: number;
}

function renderFeedbacks(feedbacks: Feedback[]) {
    const tbody = document.querySelector('.reviews-count tbody');
    if (tbody) {
        tbody.innerHTML = '';

        feedbacks.forEach(feedback => {
            const row = `<tr id="feedback-${feedback.id}">
                            <td>${feedback.score}</td>
                            <td>${feedback.name}</td>
                            <td>
                                <button class="edit" onclick="editFeedback(${feedback.id})"><span class="material-symbols-outlined">edit</span></button>
                                <button class="edit" onclick="deleteFeedback(${feedback.id})"><span class="material-symbols-outlined">close</span></button>
                            </td>
                        </tr>`;
            tbody.innerHTML += row;
        });
    }
}

function deleteFeedback(id: number) {
    const storedFeedbacks: Feedback[] = JSON.parse(localStorage.getItem('feedbacks') || '[]');
    const index = storedFeedbacks.findIndex(feedback => feedback.id === id);
    if (index !== -1) {
        const confirmation = confirm("Bạn có muốn xóa khôngl?");
        if (confirmation) {
            storedFeedbacks.splice(index, 1);
            localStorage.setItem('feedbacks', JSON.stringify(storedFeedbacks));
            
            renderFeedbacks(storedFeedbacks);
        }
    }
}

function editFeedback(id: number) {
    const storedFeedbacks: Feedback[] = JSON.parse(localStorage.getItem('feedbacks') || '[]');
    const feedbackToEdit = storedFeedbacks.find(feedback => feedback.id === id);
    if (feedbackToEdit) {
        const reviewInput = document.getElementById('reviewInput') as HTMLInputElement;
        const ratingInputs = document.querySelectorAll('input[name="rating"]') as NodeListOf<HTMLInputElement>;

        reviewInput.value = feedbackToEdit.name;
        ratingInputs.forEach(input => {
            if (parseInt(input.value) === feedbackToEdit.score) {
                input.checked = true;
            }
        });

        const sendButton = document.getElementById('sendButton');
        if (sendButton) {
            sendButton.innerHTML = 'Update';
            sendButton.removeEventListener('click', addFeedback);
            sendButton.addEventListener('click', () => updateFeedback(id));
        }
    }
}

function updateFeedback(id: number) {
    const storedFeedbacks: Feedback[] = JSON.parse(localStorage.getItem('feedbacks') || '[]');
    const reviewInput = document.getElementById('reviewInput') as HTMLInputElement;
    const ratingInput = document.querySelector('input[name="rating"]:checked') as HTMLInputElement;

    const updatedFeedback: Feedback = {
        id: id,
        score: parseInt(ratingInput.value),
        name: reviewInput.value
    };

    const index = storedFeedbacks.findIndex(feedback => feedback.id === id);
    if (index !== -1) {
        storedFeedbacks[index] = updatedFeedback;
        localStorage.setItem('feedbacks', JSON.stringify(storedFeedbacks));
        renderFeedbacks(storedFeedbacks);

        const sendButton = document.getElementById('sendButton');
        if (sendButton) {
            sendButton.innerHTML = 'Send';
            sendButton.removeEventListener('click', updateFeedback);
            sendButton.addEventListener('click', addFeedback);
        }

        reviewInput.value = '';
    }
}

const sendButton = document.getElementById('sendButton');
if (sendButton) {
    sendButton.addEventListener('click', addFeedback);
}

function addFeedback() {
    const reviewInput = document.getElementById('reviewInput') as HTMLInputElement;
    const ratingInput = document.querySelector('input[name="rating"]:checked') as HTMLInputElement;

    const newFeedback: Feedback = {
        id: Date.now(),
        score: parseInt(ratingInput.value),
        name: reviewInput.value
    };

    const storedFeedbacks: Feedback[] = JSON.parse(localStorage.getItem('feedbacks') || '[]');
    storedFeedbacks.push(newFeedback);
    localStorage.setItem('feedbacks', JSON.stringify(storedFeedbacks));
    renderFeedbacks(storedFeedbacks);
    window.location.reload()
    reviewInput.value = '';
}

document.addEventListener('DOMContentLoaded', () => {
    renderFeedbacks(JSON.parse(localStorage.getItem('feedbacks') || '[]'));
});
