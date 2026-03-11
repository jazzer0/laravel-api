<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Task extends Model
{
    use SoftDeletes;
    public function project(){
        return $this->belongsTo(Project::class);
    }

    public function scopeOverdue($query){
        return $query->where('due_date', '<', now())->where('status', '!=', 'done');
    }
}
