// Switching between forms
document.getElementById('login-link').addEventListener('click', function () {
    document.getElementById('register-form').style.display = 'none';
    document.getElementById('login-form').style.display = 'block';
});

document.getElementById('register-link').addEventListener('click', function () {
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('register-form').style.display = 'block';
});

// Registration
document.getElementById('register-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const username = document.getElementById('reg-username').value;
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;

    if (username && email && password) {
        const users = JSON.parse(localStorage.getItem('users')) || [];

        const userExists = users.some(user => user.username === username || user.email === email);

        if (userExists) {
            alert('Username or email already exists!');
        } else {
            users.push({ username, email, password });
            localStorage.setItem('users', JSON.stringify(users));
            alert('Registration successful!');
            document.getElementById('register-form').reset();
        }
    } else {
        alert('Please fill in all fields.');
    }
});

// Login
document.getElementById('login-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    const users = JSON.parse(localStorage.getItem('users')) || [];

    const user = users.find(user => user.username === username && user.password === password);

    if (user) {
        alert('Login successful!');
        window.location.href = 'create-quiz.html';
    } else {
        alert('Invalid username or password.');
    }
});
