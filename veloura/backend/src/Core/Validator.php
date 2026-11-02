<?php
declare(strict_types=1);

namespace App\Core;

/** Validasi mirip Form Request Laravel -> 422 + error per field. */
final class Validator
{
    private static function len(string $s): int { return function_exists("mb_strlen") ? mb_strlen($s) : strlen($s); }

    public static function validate(array $data, array $rules): array
    {
        $errors = [];
        foreach ($rules as $field => $ruleStr) {
            $val = $data[$field] ?? null;
            $rs = explode('|', $ruleStr);
            if ($val === null || $val === '') {
                if (in_array('required', $rs, true)) $errors[$field][] = "Field $field wajib diisi.";
                continue;
            }
            foreach ($rs as $r) {
                [$name, $arg] = array_pad(explode(':', $r, 2), 2, null);
                $msg = match ($name) {
                    'email' => filter_var($val, FILTER_VALIDATE_EMAIL) ? null : 'Format email tidak valid.',
                    'numeric' => is_numeric($val) ? null : "Field $field harus berupa angka.",
                    'integer' => filter_var($val, FILTER_VALIDATE_INT) !== false ? null : "Field $field harus bilangan bulat.",
                    'min' => (is_numeric($val) ? $val >= $arg : self::len((string) $val) >= (int) $arg) ? null : "Field $field minimal $arg.",
                    'max' => (is_numeric($val) ? $val <= $arg : self::len((string) $val) <= (int) $arg) ? null : "Field $field maksimal $arg.",
                    'in' => in_array($val, explode(',', $arg), true) ? null : "Nilai $field tidak valid.",
                    default => null,
                };
                if ($msg) $errors[$field][] = $msg;
            }
        }
        if ($errors) Response::error('Data tidak valid.', 422, $errors);
        return array_intersect_key($data, $rules);
    }
}
