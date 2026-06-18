// Authentication Handler
document.addEventListener('DOMContentLoaded', async () => {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const signupBtn = document.getElementById('signupBtn');
    const loginBtn = document.getElementById('loginBtn');
    const errorMsg = document.getElementById('errorMsg');
    const loading = document.getElementById('loading');

    // Toggle between login and signup
    signupBtn.addEventListener('click', (e) => {
        e.preventDefault();
        loginForm.classList.add('hidden');
        signupForm.classList.remove('hidden');
        errorMsg.classList.add('hidden');
    });

    loginBtn.addEventListener('click', (e) => {
        e.preventDefault();
        signupForm.classList.add('hidden');
        loginForm.classList.remove('hidden');
        errorMsg.classList.add('hidden');
    });

    // Login Handler
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        loading.classList.remove('hidden');
        errorMsg.classList.add('hidden');

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password
            });

            if (error) throw error;

            // Save user session
            localStorage.setItem('user_id', data.user.id);
            localStorage.setItem('user_email', data.user.email);

            // Redirect to app
            window.location.href = 'app.html';
        } catch (error) {
            errorMsg.textContent = '❌ ' + (error.message || 'Login failed');
            errorMsg.classList.remove('hidden');
        } finally {
            loading.classList.add('hidden');
        }
    });

    // Sign Up Handler
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('signupEmail').value;
        const password = document.getElementById('signupPassword').value;

        loading.classList.remove('hidden');
        errorMsg.classList.add('hidden');

        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password
            });

            if (error) throw error;

            errorMsg.textContent = '✅ Account created! Please check your email to verify.';
            errorMsg.classList.remove('hidden');
            errorMsg.classList.add('bg-green-50', 'text-green-700');

            // Auto login after 2 seconds
            setTimeout(() => {
                document.getElementById('email').value = email;
                document.getElementById('password').value = password;
                loginForm.classList.remove('hidden');
                signupForm.classList.add('hidden');
            }, 2000);
        } catch (error) {
            errorMsg.textContent = '❌ ' + (error.message || 'Sign up failed');
            errorMsg.classList.remove('hidden');
        } finally {
            loading.classList.add('hidden');
        }
    });

    // Check if already logged in
    const session = await supabase.auth.getSession();
    if (session?.data?.session) {
        window.location.href = 'app.html';
    }
});
