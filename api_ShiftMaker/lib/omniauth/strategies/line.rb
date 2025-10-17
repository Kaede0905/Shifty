option :authorize_params, %i[scope]

def authorize_params
  super.tap do |params|
    extra = request.params.slice("mode") # POSTのhidden fieldを拾う
    params[:state] = extra.to_json if extra.present?
  end
end
