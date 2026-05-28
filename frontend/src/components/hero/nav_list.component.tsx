return (
  <header className="sticky top-0 z-50 w-full bg-white/90 supports-[backdrop-filter]:bg-white/75 dark:bg-[#0B1120]/80 dark:supports-[backdrop-filter]:bg-[#0B1120]/70 backdrop-blur-md border-b border-slate-200/70 dark:border-white/10 transition-colors duration-300 transform-gpu">
    <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3">
      <div className="flex items-center justify-between w-full gap-2">

        {/* Logo */}
        <div className="flex items-center shrink-0">
          <Link to="/">
            <img src={logo} alt="logo" className="h-9 w-auto object-contain" />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden xl:flex flex-1 items-center justify-center gap-1 px-2">
          <NavLink to="/" end className={({ isActive }) => getLinkClass(isActive)}>
            {({ isActive }) => (
              <>
                {isActive && (
                  <span className="w-1.5 h-1.5 bg-custom rounded-full animate-pulse shadow-[0_0_8px_#3b82f6]" />
                )}
                <i className="fa-solid fa-house" />
                HOME
              </>
            )}
          </NavLink>

          <NavLink to="/explore" className={({ isActive }) => getLinkClass(isActive)}>
            {({ isActive }) => (
              <>
                {isActive && (
                  <span className="w-1.5 h-1.5 bg-custom rounded-full animate-pulse shadow-[0_0_8px_#3b82f6]" />
                )}
                <i className="fa-solid fa-compass" />
                EXPLORE
              </>
            )}
          </NavLink>

          <NavLink to="/story-inspiration" className={({ isActive }) => getLinkClass(isActive)}>
            {({ isActive }) => (
              <>
                {isActive && (
                  <span className="w-1.5 h-1.5 bg-custom rounded-full animate-pulse shadow-[0_0_8px_#3b82f6]" />
                )}
                <i className="fa-solid fa-book-open" />
                INSPIRING
              </>
            )}
          </NavLink>

          <NavLink to="/analytics" className={({ isActive }) => getLinkClass(isActive)}>
            {({ isActive }) => (
              <>
                {isActive && (
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-custom animate-pulse shadow-[0_0_8px_#3b82f6]" />
                )}
                <i className="fa-solid fa-chart-column" />
                ANALYTICS
              </>
            )}
          </NavLink>

          <NavLink to="/collab" className={({ isActive }) => getLinkClass(isActive)}>
            {({ isActive }) => (
              <>
                {isActive && (
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-custom animate-pulse shadow-[0_0_8px_#3b82f6]" />
                )}
                <i className="fa-solid fa-pen-nib" />
                COLLAB
              </>
            )}
          </NavLink>

          <NavLink to="/contact-us" className={({ isActive }) => getLinkClass(isActive)}>
            {({ isActive }) => (
              <>
                {isActive && (
                  <span className="w-1.5 h-1.5 bg-custom rounded-full animate-pulse shadow-[0_0_8px_#3b82f6]" />
                )}
                <i className="fa-solid fa-envelope" />
                CONTACT
              </>
            )}
          </NavLink>

          <NavLink to="/community" className={({ isActive }) => getLinkClass(isActive)}>
            {({ isActive }) => (
              <>
                {isActive && (
                  <span className="w-1.5 h-1.5 bg-custom rounded-full animate-pulse shadow-[0_0_8px_#3b82f6]" />
                )}
                <i className="fa-solid fa-users" />
                COMMUNITY
              </>
            )}
          </NavLink>

          {isLogin && (
            <>
              <NavLink to="/bookmarks" className={({ isActive }) => getLinkClass(isActive)}>
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <span className="w-1.5 h-1.5 bg-custom rounded-full animate-pulse shadow-[0_0_8px_#3b82f6]" />
                    )}
                    <i className="fa-solid fa-bookmark" />
                    SAVED
                  </>
                )}
              </NavLink>

              {isAdmin && (
                <NavLink to="/dashboard" className={({ isActive }) => getLinkClass(isActive)}>
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <span className="w-1.5 h-1.5 bg-custom rounded-full animate-pulse shadow-[0_0_8px_#3b82f6]" />
                      )}
                      <i className="fa-solid fa-table-columns" />
                      DASHBOARD
                    </>
                  )}
                </NavLink>
              )}
            </>
          )}
        </nav>

        {/* Right Side */}
        <div className="flex items-center gap-2 shrink-0">

          {/* Desktop Actions */}
          <div className="hidden xl:flex items-center gap-1.5">

            <button
              type="button"
              aria-label="Open Help Center"
              onClick={() => navigate("/help-center")}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full text-slate-600 dark:text-slate-400 transition-all duration-300 hover:bg-slate-200/60 hover:text-slate-900 dark:hover:bg-white/5 dark:hover:text-white"
            >
              <i className="fas fa-circle-question" />
            </button>

            {isLogin ? (
              <button
                onClick={handelLogout}
                className="inline-flex h-9 items-center justify-center rounded-md px-3 text-xs font-semibold text-slate-600 transition-all duration-300 hover:bg-slate-200/60 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-white"
              >
                LOGOUT
              </button>
            ) : (
              <>
                <Link to="/login">
                  <button className="inline-flex h-9 items-center justify-center rounded-md px-3 text-xs font-semibold text-slate-600 transition-all duration-300 hover:bg-slate-200/60 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-white">
                    LOGIN
                  </button>
                </Link>

                <Link to="/signup">
                  <button className="inline-flex h-9 items-center justify-center rounded-md px-3 text-xs font-semibold text-slate-600 transition-all duration-300 hover:bg-slate-200/60 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-white">
                    SIGN UP
                  </button>
                </Link>
              </>
            )}

            <ThemeToggle />

            <div className="relative inline-flex" ref={notificationMenuRef}>
              <button
                type="button"
                aria-label="Notifications"
                className="relative inline-flex h-9 w-9 items-center justify-center rounded-full text-slate-600 transition-all duration-300 hover:bg-slate-200/60 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-white"
                data-notification-trigger="true"
                onClick={toggle}
              >
                <i className="fa-solid fa-bell" />

                {unreadCount > 0 && (
                  <span className="absolute right-0 top-0 grid min-h-[18px] min-w-[18px] -translate-y-1/2 translate-x-1/2 place-items-center rounded-full bg-rose-500 px-1 text-[11px] font-semibold text-white">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Mobile Actions */}
          <div className="flex xl:hidden items-center gap-1.5">
            <ThemeToggle />

            <button
              type="button"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((prev) => !prev)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full text-slate-600 dark:text-slate-400 transition-all duration-300 hover:bg-slate-200/60 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white"
            >
              <i className={menuOpen ? "fa-solid fa-xmark text-lg" : "fa-solid fa-bars text-lg"} />
            </button>
          </div>
        </div>
      </div>

      <NotificationComponent
        notifications={notifications}
        showNotification={isOpen}
        setShowNotification={close}
        unreadCount={unreadCount}
        onMarkAsRead={markAsRead}
      />

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="xl:hidden mt-2 px-1 pb-4 flex flex-col gap-1.5 border-t border-slate-200/70 dark:border-white/10 pt-3">

          <NavLink
            to="/"
            end
            className={({ isActive }) => getMobileLinkClass(isActive)}
            onClick={() => setMenuOpen(false)}
          >
            {({ isActive }) => renderMobileNavContent("HOME", isActive)}
          </NavLink>

          <NavLink
            to="/explore"
            className={({ isActive }) => getMobileLinkClass(isActive)}
            onClick={() => setMenuOpen(false)}
          >
            {({ isActive }) => renderMobileNavContent("EXPLORE", isActive)}
          </NavLink>

        </div>
      )}
    </div>
  </header>
);