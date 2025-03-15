document.getElementById("contact-form").addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent default submission

    const formData = new FormData(this);
    const submission = {
        name: formData.get("name"),
        email: formData.get("email"),
        message: formData.get("message"),
        date: new Date().toISOString()
    };

    // Send form data to FormSubmit
    fetch(this.action, {
        method: "POST",
        body: formData,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })
    .then(response => {
        if (!response.ok) throw new Error("Email failed, saving to GitHub...");
        return response.json();
    })
    .then(() => {
        window.location.href = "thank-you.html"; // Redirect on success
    })
    .catch(() => {
        // Save to GitHub if email fails
        fetch("https://api.github.com/repos/YOUR_USERNAME/YOUR_REPO/contents/submissions.csv", {
            method: "GET",
            headers: {
                "Authorization": "token YOUR_GITHUB_PERSONAL_ACCESS_TOKEN",
                "Accept": "application/vnd.github.v3+json"
            }
        })
        .then(res => res.json())
        .then(data => {
            let csvContent = atob(data.content) + `\n${submission.name},${submission.email},${submission.message},${submission.date}`;
            let updatedContent = btoa(csvContent);

            return fetch(`https://api.github.com/repos/YOUR_USERNAME/YOUR_REPO/contents/submissions.csv`, {
                method: "PUT",
                headers: {
                    "Authorization": "token YOUR_GITHUB_PERSONAL_ACCESS_TOKEN",
                    "Accept": "application/vnd.github.v3+json"
                },
                body: JSON.stringify({
                    message: "New form submission",
                    content: updatedContent,
                    sha: data.sha
                })
            });
        })
        .then(() => window.location.href = "thank-you.html")
        .catch(error => console.error("GitHub save failed:", error));
    });
});

import "@fontsource/metropolis"; // Defaults to weight 400
import "@fontsource/metropolis/400.css"; // Specify weight
import "@fontsource/metropolis/400-italic.css"; // Specify weight and style
import "@fontsource/metropolis/700.css"; // Bold font