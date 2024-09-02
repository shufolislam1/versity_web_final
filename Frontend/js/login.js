
const handleLogin = async (e) => {
    e.preventDefault();

    const userId = document.getElementById('userid').value;
    const userPassword = document.getElementById('password').value;

    const user = {
        userId: userId,
        password: userPassword
    }

    try {
        const userInfo = await fetchUserInfo(user);

        console.log("User Info:", userInfo); // Log what is returned

        const errorElement = document.getElementById('login-error');

        if (!userInfo || userInfo.length === 0) {
            errorElement.classList.remove('hidden');
            console.log("Error message shown");
        } else {
            errorElement.classList.add('hidden');
            console.log("Error message hidden");
            localStorage.setItem("loggedInUser", JSON.stringify(userInfo[0]));
            window.location.href = '/post.html';
        }
    } catch (error) {
        console.error("An unexpected error occurred:", error);
        const errorElement = document.getElementById('login-error');
        errorElement.classList.remove('hidden');
        errorElement.querySelector('.error-text').textContent = "An unexpected error occurred. Please try again.";
    }
};


const fetchUserInfo = async (user) => {
    let data;
    try {
        const res = await fetch('http://localhost:3000/getUserInfo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        });

        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }

        data = await res.json();
    } catch (error) {
        console.error('Error:', error);
        data = null;
    } finally {
        console.log('Fetch attempt finished', data);
    }
    
    return data;
}
