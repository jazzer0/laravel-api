<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreTaskRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }
    public function rules(): array 
    {
        return [
            "title"       => ["required","string","max:255"],
            "description" => ["nullable","string"],
            "status"      => ["sometimes","in:todo,in_progress,done"],
            "priority"    => ["sometimes","in:low,medium,high"],
            "due_date"    => ["nullable","date","after_or_equal:today"],
        ];
    }

}
