/* ==========================================================================
   VELOURA - LOGIN & REGISTER
   ========================================================================== */


/* =========================================================
   SWITCH TAB
========================================================= */

function switchTab(mode) {

    const isSignin =
        mode === 'signin';


    const signinForm =
        document.querySelector('#signin-form');

    const registerForm =
        document.querySelector('#register-form');

    const signinTab =
        document.querySelector('#tab-signin-btn');

    const registerTab =
        document.querySelector('#tab-register-btn');


    if (!signinForm || !registerForm) {
        return;
    }


    signinForm.style.display =
        isSignin ? 'block' : 'none';


    registerForm.style.display =
        isSignin ? 'none' : 'block';


    signinTab.classList.toggle(
        'active',
        isSignin
    );


    registerTab.classList.toggle(
        'active',
        !isSignin
    );

}



/* =========================================================
   EYE ICON
========================================================= */

function getEyeIcon(hidden) {

    if (hidden) {

        return `
            <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
            >
                <path
                    d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z"
                ></path>

                <circle
                    cx="12"
                    cy="12"
                    r="2.5"
                ></circle>
            </svg>
        `;

    }


    return `
        <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
        >
            <path
                d="M3 3l18 18"
            ></path>

            <path
                d="M10.6 10.6a2 2 0 0 0 2.8 2.8"
            ></path>

            <path
                d="M9.9 4.3A11.6 11.6 0 0 1 12 4c6.5 0 10 6 10 6s-1.3 2.2-3.5 3.8"
            ></path>

            <path
                d="M6.1 6.1C3.5 8.1 2 10 2 10s3.5 6 10 6c1.1 0 2.1-.2 3-.5"
            ></path>
        </svg>
    `;

}



/* =========================================================
   TOGGLE PASSWORD
========================================================= */

function togglePasswordVisibility(
    inputId,
    btn
) {

    const input =
        document.querySelector(`#${inputId}`);


    if (!input || !btn) {
        return;
    }


    const isPassword =
        input.type === 'password';


    input.type =
        isPassword ? 'text' : 'password';


    btn.innerHTML =
        getEyeIcon(!isPassword);


    btn.setAttribute(
        'aria-label',
        isPassword
            ? 'Hide password'
            : 'Show password'
    );

}



/* =========================================================
   LOGIN / REGISTER
========================================================= */

async function handleAuthSubmit(
    e,
    mode
) {

    e.preventDefault();


    const form =
        e.target;


    const submitBtn =
        form.querySelector(
            'button[type="submit"]'
        );


    if (!submitBtn) {
        return;
    }


    const original =
        submitBtn.innerHTML;


    const isSignin =
        mode === 'signin';


    const payload =
        isSignin

            ? {
                email:
                    form
                        .querySelector(
                            '#signin-email'
                        )
                        .value
                        .trim(),

                password:
                    form
                        .querySelector(
                            '#signin-password'
                        )
                        .value
            }

            : {
                name:
                    form
                        .querySelector(
                            '#reg-name'
                        )
                        .value
                        .trim(),

                email:
                    form
                        .querySelector(
                            '#reg-email'
                        )
                        .value
                        .trim(),

                password:
                    form
                        .querySelector(
                            '#reg-password'
                        )
                        .value
            };


    /* =========================
       PASSWORD VALIDATION
    ========================= */

    if (
        payload.password.length < 6
    ) {

        showToast(
            'Password must be at least 6 characters.'
        );

        return;
    }


    /* =========================
       LOADING
    ========================= */

    submitBtn.disabled = true;

    submitBtn.innerHTML =
        `
            <span>
                Memproses...
            </span>
        `;


    try {

        /* =========================
           API REQUEST
        ========================= */

        const res =
            await apiFetch(
                isSignin
                    ? '/auth/login'
                    : '/auth/register',
                {
                    method: 'POST',

                    body: payload,

                    auth: false
                }
            );


        /* =========================
           SAVE SESSION
        ========================= */

        saveSession(
            res.data.token,
            res.data.user
        );


        /* =========================
           SUCCESS MESSAGE
        ========================= */

        showToast(
            isSignin
                ? 'Login successful! Redirecting... ✨'
                : 'Account created! Welcome to Veloura! ✨'
        );


        /* =========================
           REDIRECT
        ========================= */

        const target =
            res.data.user.role === 'admin'
                ? 'admin/index.html'
                : 'index.html';


        setTimeout(
            () => {
                location.href =
                    target;
            },
            900
        );


    } catch (err) {

        /* =========================
           ERROR
        ========================= */

        const firstField =
            Object.values(
                err.errors || {}
            )[0];


        showToast(
            firstField
                ? firstField[0]
                : err.message
        );


        submitBtn.disabled =
            false;


        submitBtn.innerHTML =
            original;

    }

}