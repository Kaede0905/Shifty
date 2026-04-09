class ApplicationController < ActionController::Base
  def frontend_index
    render file: Rails.public_path.join('index.html')
  end
end
