<?php

namespace Biz\InformationCollect\FormItem;

class SchoolFormItem extends FormItem
{
    const TYPE = 'input';

    const TITLE = '学校';

    const FIELD = 'school';

    public function getData()
    {
        return [
            'type' => self::TYPE,
            'title' => self::TITLE,
            'field' => self::FIELD,
            'value' => $this->value,
            'validate' => [
                ['required' => $this->required, 'message' => self::TITLE.'不能为空'],
                ['min' => 2, 'message' => '最少输入2个字符'],
                ['max' => 40, 'message' => '最多输入40个字符'],
            ],
        ];
    }
}
