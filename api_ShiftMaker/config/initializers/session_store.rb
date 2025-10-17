Rails.application.config.session_store :cookie_store,
  key: "_shift_maker_session",
  same_site: :none,
  secure: false
