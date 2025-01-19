const Auth = {
  users: JSON.parse(localStorage.getItem('users')) || [],
  currentUser: null,

  initializeAuth() {
    // Kontrola přihlášení
    this.checkAuth();

    // Přihlášení
    $('#auth-form').on('submit', (e) => {
      e.preventDefault();
      const email = $('#email').val().trim();
      const password = $('#password').val().trim();

      if (!email || !password) {
        Swal.fire('Chyba!', 'Vyplňte všechny údaje.', 'error');
        return;
      }

      const user = this.users.find((u) => u.email === email);
      if (user) {
        if (user.password === password) {
          this.currentUser = user;
          localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
          this.checkAuth();
          Swal.fire('Úspěch!', 'Přihlášení proběhlo úspěšně.', 'success');
        } else {
          Swal.fire('Chyba!', 'Špatné heslo.', 'error');
        }
      } else {
        this.registerUser(email, password);
      }
    });

    // Odhlášení
    $('#logout-btn').on('click', () => {
      this.logout();
    });
  },

  registerUser(email, password) {
    const newUser = { email, password, itineraries: [] };
    this.users.push(newUser);
    localStorage.setItem('users', JSON.stringify(this.users));
    Swal.fire('Úspěch!', 'Registrace proběhla úspěšně. Nyní se můžete přihlásit.', 'success');
  },

  checkAuth() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (this.currentUser) {
      $('#auth-section').hide();
      $('#main-section').show();
      $('#user-email').text(this.currentUser.email);
    } else {
      $('#auth-section').show();
      $('#main-section').hide();
    }
  },

  logout() {
    this.currentUser = null;
    localStorage.removeItem('currentUser');
    this.checkAuth();
  },
};
