class Api::V1::ShiftController < ApplicationController
  def create
    results = []
    user_id = session[:id]
    store_id = params['store_id']
    store_connect = EmployeeStoreAssignment.find_by(
      employee_account_id:user_id,
      store_id:store_id
    )
    store_connect_id = store_connect.id
    year = params['year'].to_i
    month = params['month'].to_i

    start_date = Date.new(year, month, 1)
    end_date = start_date.end_of_month

    Shift.where(
      employee_account_id: user_id,
      store_connect_id: store_connect_id,
      work_date: start_date..end_date
    ).delete_all

    params['shifts'].each do |date, shifts|
      if shifts.present?
        shifts.each do |shift|
          start_hour = shift["start"]["h"].to_i
          start_min  = shift["start"]["m"].to_i rescue 0
          end_hour   = shift["end"]["h"].to_i
          end_min    = shift["end"]["m"].to_i rescue 0
          start_time = "#{start_hour}:#{start_min}"
          end_time = "#{end_hour}:#{end_min}"
          status = shift['type'] || 'saved'
          shift_new = Shift.new(
            employee_account_id: user_id,
            store_connect_id: store_connect_id,
            work_date: date,
            start_time: start_time,
            end_time: end_time,
            status: status
          )
          if shift_new.save
            next
          else
            render json: { errors: shift_new.errors.full_messages }, status: :unprocessable_entity
            return
          end
        end
      end
    end
    render json: { message: "#{year}年#{month}月のシフトが保存されました。", results: results }, status: :ok
  end

  def submit
    user_id = session[:id]
    store_id = params['store_id']
    store_connect = EmployeeStoreAssignment.find_by(
      employee_account_id:user_id,
      store_id:store_id
    )
    store_connect_id = store_connect.id
    year = params['year'].to_i
    month = params['month'].to_i

    start_date = Date.new(year, month, 1)
    end_date = start_date.end_of_month

    saved_shifts = Shift.where(
      employee_account_id: user_id,
      store_connect_id: store_connect_id,
      status: "saved",
      work_date: start_date..end_date
    )
    saved_shifts.each do |shift|
      if shift.update(status: "submit")
      else
        render json: { errors: shift_new.errors.full_messages }, status: :unprocessable_entity
        return
      end
    end
    render json: { message: "#{year}年#{month}月のシフトが送信されました。"}, status: :ok
  end

  def pull
    user_id = session[:id]
    store_id = params[:store_id].to_i
    store_connect = EmployeeStoreAssignment.find_by(
      employee_account_id: user_id,
      store_id: store_id
    )
    return render json: { error: "Store not found" }, status: :not_found unless store_connect

    store_connect_id = store_connect.id
    year  = params[:year].to_i
    month = params[:month].to_i

    # 月初と月末を計算
    start_date = Date.new(year, month, 1)
    end_date   = start_date.end_of_month

    # 日付範囲で絞り込む
    shifts = Shift.where(
      employee_account_id: user_id,
      store_connect_id: store_connect_id,
      work_date: start_date..end_date
    )

    # 日付ごとに整形
    formatted_shifts = shifts.group_by { |s| s.work_date.strftime("%Y/%-m/%-d") }
                            .transform_values do |arr|
      arr.map do |s|
        {
          start: { h: s.start_time.hour, m: s.start_time.min },
          end:   { h: s.end_time.hour, m: s.end_time.min },
          type:  s.status
        }
      end
    end

    render json: formatted_shifts
  end


  def calender
    user_id = session[:id]
    store_id = params['store_id']
    store_connect = EmployeeStoreAssignment.find_by(
      employee_account_id:user_id,
      store_id:store_id
    )
    store_connect_id = store_connect.id

    # パラメータがなければ今日の週にする
    start_date = params['currentSunday'].present? ? Date.parse(params['currentSunday']) : Date.today.beginning_of_week
    end_date   = params['currentSaturday'].present? ? Date.parse(params['currentSaturday']) : Date.today.end_of_week

    saved_shifts = Shift.where(
      employee_account_id: user_id,
      store_connect_id: store_connect_id,
      work_date: start_date..end_date
    )

    result = (start_date..end_date).map do |date|
      day_shifts = saved_shifts.select { |s| s.work_date == date && s.status != "rejected" }
      {
        day: ["日","月","火","水","木","金","土"][date.wday],
        time: day_shifts.map { |s| "#{s.start_time.strftime('%H:%M')} - #{(s.end_time + 30.minutes).strftime('%H:%M')}" },
        confirmed: day_shifts.any? { |s| %w[submit approved].include?(s.status) }
      }.tap do |hash|
        hash[:time] = nil if hash[:time].empty?
      end
    end

    render json: { message: "シフトの取得に成功", result: result }, status: :ok
    p result
  end

  def month
    user_id = session[:id]
    store_id = params['store_id']
    store_connect = EmployeeStoreAssignment.find_by(
      employee_account_id:user_id,
      store_id:store_id
    )
    store_connect_id = store_connect.id
    start_date = params['startDate']
    end_date = params['endDate']
    shifts = Shift.where(store_connect_id: store_connect_id)
                  .where(work_date: start_date..end_date)
    result = {}
    shifts.each do |shift|
      date = shift.work_date.strftime("%Y-%m-%d")
      result[date] ||= []
      result[date] << {
        time: "#{shift.start_time.strftime("%H:%M")} - #{(shift.end_time + 30.minutes).strftime("%H:%M")}",
        status: shift.status
      }
    end

    render json: result
  end

  def employer
    store_id = params['store_id']
    store_connects = EmployeeStoreAssignment.where(store_id:store_id)
    shifts = []
    store_connects.each do |store_connect|
      userId = store_connect.employee_account_id
      user = EmployeeAccount.find_by(id:userId)
      pre_shifts = Shift.where(store_connect_id: store_connect.id)
      pre_shifts.each do |shift|
        if shift.status == "submit" || shift.status == "approved" || shift.status == "rejected"
          end_time = shift.end_time ? (shift.end_time + 30.minutes).strftime("%H:%M") : nil
          if shift.end_time&.strftime("%H:%M") == "23:30"
            end_time = "24:00"
          end
          shifts << {
            id: shift.id,
            employee_account_id: store_connect.employee_account_id,
            employee_account_name: user&.name,
            store_connect_id: store_connect.id,
            work_date: shift.work_date,
            start_time: shift.start_time&.strftime("%H:%M"),
            end_time: end_time,
            status: shift.status,
            note: shift.note
          }
        end
      end
    end
    render json: { shifts: shifts }, status: :ok
  end

  def delete
    user_id = session[:id]
    store_id = params['store_id']
    store_connect = EmployeeStoreAssignment.find_by(
      employee_account_id:user_id,
      store_id:store_id
    )
    store_connect_id = store_connect.id
    p store_connect_id
  end

  def employer_comfirm
    new_shift = params["shift"]
    shift = Shift.find_by(id: new_shift[:id])
    if shift.nil?
      render json: { errors: "シフトが見つかりません" }, status: :not_found
      return
    end
    end_time_str = new_shift[:end_time]
    end_time = Time.parse(end_time_str)
    new_end_time = (end_time - 30.minutes).strftime("%H:%M")
    if shift.update(
      start_time: new_shift[:start_time],
      end_time: new_end_time,
      status: "approved",
      note:   new_shift[:note]
    )
      render json: { message: "シフトを更新しました", shift: shift }, status: :ok
    else
      render json: { errors: shift.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def employer_delete
    new_shift = params["shift"]
    shift = Shift.find_by(id: new_shift[:id])
    if shift.nil?
      render json: { errors: "シフトが見つかりません" }, status: :not_found
      return
    end
    if shift.update(
      status: "rejected",
      note: new_shift[:note]
    )
      render json: { message: "シフトを削除しました", shift: shift }, status: :ok
    else
      render json: { errors: shift.errors.full_messages }, status: :unprocessable_entity
    end
  end
end
