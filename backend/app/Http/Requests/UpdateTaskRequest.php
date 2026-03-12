<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateTaskRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool {
        return true;
    }
    public function rules(): array 
    {
        return [
            "status"   => ["sometimes", "in:todo,in_progress,done"],
            "priority" => ["sometimes", "in:low,medium,high"],
        ];
    }
}
