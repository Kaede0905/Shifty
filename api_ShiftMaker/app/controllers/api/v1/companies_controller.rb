class Api::V1::CompaniesController < ApplicationController
  def create
    company = Company.new(company_params)
    company.public_id ||= SecureRandom.hex(4)
    company.status ||= "active"
    company.contract_start_at ||= Time.now
    company.contract_end_at ||= Time.now + 1.year
    company.logo_url ||= "https://ui-avatars.com/api/?name=#{company.name}&background=random"

    if company.save
      render json: { company: company, message: "会社を作成しました" }, status: :created
    else
      render json: { errors: company.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def show
    @company = Company.find_by(id: params[:id]) || Company.find_by(public_id: params[:id])
    if @company
      render json: {
        company: @company.as_json(only: [
          :id, :name, :public_id, :status, :contract_fee,
          :contract_start_at, :contract_end_at, :logo_url
        ])
      }
    else
      render json: { error: "会社が見つかりませんでした" }, status: :not_found
    end
  end

  private

  def company_params
    params.require(:company).permit(:name, :public_id, :status, :contract_fee, :contract_start_at, :contract_end_at, :logo_url)
  end

  def set_company
    @company = Company.find_by(id: params[:id]) || Company.find_by(public_id: params[:id])
    unless @company
      render json: { errors: "会社が見つかりません" }, status: :not_found
    end
  end
end
