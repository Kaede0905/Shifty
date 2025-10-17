class Store < ApplicationRecord
  belongs_to :company, optional: true
end
