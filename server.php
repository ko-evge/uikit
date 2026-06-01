<?php
/**
 * IMS2 - REST API Backend
 * Modern PHP API using fetch/JSON
 * Both action-based and RESTful endpoints
 */

// Headers
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Error handling
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set("log_errors", 1);
ini_set("error_log", "php-error.log");

// Get request method and body
$method = $_SERVER['REQUEST_METHOD'];
$input = json_decode(file_get_contents('php://input'), true);

// Default response
$response = [
    'success' => false,
    'data' => null,
    'error' => null
];

try {
    // Database connection
    $host = 'localhost';
    $db = 'msdata1';
    $user = 'root';
    $pass = 'pointer9';
    $charset = 'utf8';

    $dsn = "mysql:host=$host;dbname=$db;charset=$charset";
    $opt = [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ];
    $conn = new PDO($dsn, $user, $pass, $opt);

    // ============================================
    // ACTION-BASED ENDPOINTS (Legacy support)
    // ============================================
    if ($input && isset($input['action'])) {
        $action = $input['action'];

        switch ($action) {
            case 'get_us':
                // Login user
                error_log('Login attempt: user=' . ($input['user'] ?? 'empty') . ', pass=' . ($input['pass'] ?? 'empty'));
                $stmt = $conn->prepare("SELECT kd_p as kdus, im_p FROM sprus WHERE im_p = ? AND pr_p = ?");
                $stmt->execute([$input['user'] ?? '', $input['pass'] ?? '']);
                $result = $stmt->fetch();
                error_log('Query result: ' . ($result ? 'found' : 'not found'));

                if ($result) {
                    $result['token'] = bin2hex(random_bytes(32));
                    $response['success'] = true;
                    $response['data'] = $result;
                } else {
                    $response['error'] = 'Invalid credentials';
                }
                break;

            case 'get_alldoc':
                // Get all documents (using kd_ps as user filter)
                $stmt = $conn->prepare("SELECT nm_zp as kd_d, kd_dk as code, dt_dk as date, kd_ps as supplier, text as comment FROM ms_dok WHERE kd_ps = ? LIMIT 100");
                $stmt->execute([$input['kdus'] ?? 0]);
                $response['success'] = true;
                $response['data'] = $stmt->fetchAll();
                break;

            case 'seek_spr':
                // Search reference
                $dir = $input['dir'] ?? '';
                $seek = '%' . ($input['seek'] ?? '') . '%';

                $query = "SELECT * FROM $dir WHERE im_ps LIKE ? OR im_ps2 LIKE ? LIMIT 50";
                $stmt = $conn->prepare($query);
                $stmt->execute([$seek, $seek]);

                $response['success'] = true;
                $response['data'] = $stmt->fetchAll();
                break;

            case 'search_ref':
                // Async search for Combo (used by Async Combo component)
                $table = $input['table'] ?? '';
                $query = $input['query'] ?? '';
                $limit = intval($input['limit'] ?? 20);

                if (!$table || !$query) {
                    $response['success'] = false;
                    $response['error'] = 'Table and query required';
                    break;
                }

                // Search in common display fields for different tables
                $displayFields = [
                    'sprps' => ['im_ps', 'im_ps2'],      // Partner name
                    'sprim' => ['nm_im', 'nm_im2'],      // Product name
                    'sprsk' => ['nm_sk', 'nm_sk2'],      // Warehouse name
                    'sprzp' => ['nm_zp', 'nm_zp2'],      // Employee name
                ];

                $fields = $displayFields[$table] ?? ['im_ps', 'im_ps2']; // Default fields
                $seek = '%' . $query . '%';

                // Build OR condition for all fields
                $conditions = implode(' OR ', array_map(fn($f) => "$f LIKE ?", $fields));
                $values = array_fill(0, count($fields), $seek);

                $sql = "SELECT * FROM $table WHERE $conditions LIMIT ?";
                $values[] = $limit;

                $stmt = $conn->prepare($sql);
                $stmt->execute($values);

                $response['success'] = true;
                $response['data'] = $stmt->fetchAll();
                break;

            case 'add_doc':
                // Create document
                $fieldMap = [
                    'code' => 'kd_dk',
                    'date' => 'dt_dk',
                    'supplier' => 'kd_ps',
                    'comment' => 'text',
                    'kdus' => 'kd_ps'
                ];

                $columns = [];
                $values = [];
                foreach ($input as $key => $value) {
                    if ($key === 'action') continue;
                    $dbField = $fieldMap[$key] ?? $key;
                    $columns[] = $dbField;
                    $values[] = $value;
                }

                $columnStr = implode(', ', $columns);
                $placeholders = array_fill(0, count($columns), '?');
                $placeholderStr = implode(', ', $placeholders);

                $query = "INSERT INTO ms_dok ($columnStr) VALUES ($placeholderStr)";
                $stmt = $conn->prepare($query);
                $stmt->execute($values);

                $response['success'] = true;
                $response['data'] = ['id' => $conn->lastInsertId(), 'message' => 'Document created'];
                break;

            case 'update_doc':
                // Update document
                $docId = $input['id'] ?? null;
                if (!$docId) throw new Exception('Document ID required');

                $fieldMap = [
                    'code' => 'kd_dk',
                    'date' => 'dt_dk',
                    'supplier' => 'kd_ps',
                    'comment' => 'text'
                ];

                $sets = [];
                $values = [];
                foreach ($input as $key => $value) {
                    if ($key === 'action' || $key === 'id') continue;
                    $dbField = $fieldMap[$key] ?? $key;
                    $sets[] = "$dbField = ?";
                    $values[] = $value;
                }
                $setStr = implode(', ', $sets);
                $values[] = $docId;

                $query = "UPDATE ms_dok SET $setStr WHERE nm_zp = ?";
                $stmt = $conn->prepare($query);
                $stmt->execute($values);

                $response['success'] = true;
                $response['data'] = ['id' => $docId, 'message' => 'Document updated'];
                break;

            case 'delete_doc':
                // Delete document
                $docId = $input['id'] ?? null;
                if (!$docId) throw new Exception('Document ID required');

                $stmt = $conn->prepare("DELETE FROM ms_dok WHERE nm_zp = ?");
                $stmt->execute([$docId]);

                $response['success'] = true;
                $response['data'] = ['id' => $docId, 'message' => 'Document deleted'];
                break;

            default:
                $response['error'] = 'Unknown action: ' . $action;
        }
    }
    // ============================================
    // RESTFUL ENDPOINTS
    // ============================================
    else if (strpos($_SERVER['REQUEST_URI'], '/api/') === 0) {
        $path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
        $parts = array_filter(explode('/', $path));

        // /api/doc or /api/doc/{id}
        if (isset($parts[2]) && $parts[2] === 'doc') {
            $docId = $parts[3] ?? null;

            switch ($method) {
                case 'POST':
                    // Create document
                    if (!$input) {
                        throw new Exception('No data provided');
                    }

                    // Map API field names to database column names
                    $fieldMap = [
                        'code' => 'kd_dk',
                        'date' => 'dt_dk',
                        'supplier' => 'kd_ps',
                        'comment' => 'text',
                        'kdus' => 'kd_ps'  // user ID maps to supplier
                    ];

                    $columns = [];
                    $values = [];
                    foreach ($input as $key => $value) {
                        $dbField = $fieldMap[$key] ?? $key;
                        $columns[] = $dbField;
                        $values[] = $value;
                    }

                    $columnStr = implode(', ', $columns);
                    $placeholders = array_fill(0, count($columns), '?');
                    $placeholderStr = implode(', ', $placeholders);

                    $query = "INSERT INTO ms_dok ($columnStr) VALUES ($placeholderStr)";
                    $stmt = $conn->prepare($query);
                    $stmt->execute($values);

                    $response['success'] = true;
                    $response['data'] = [
                        'id' => $conn->lastInsertId(),
                        'message' => 'Document created'
                    ];
                    break;

                case 'PUT':
                    // Update document
                    if (!$docId || !$input) {
                        throw new Exception('Document ID and data required');
                    }

                    // Map API field names to database column names
                    $fieldMap = [
                        'code' => 'kd_dk',
                        'date' => 'dt_dk',
                        'supplier' => 'kd_ps',
                        'comment' => 'text'
                    ];

                    $sets = [];
                    $values = [];
                    foreach ($input as $key => $value) {
                        $dbField = $fieldMap[$key] ?? $key;
                        $sets[] = "$dbField = ?";
                        $values[] = $value;
                    }
                    $setStr = implode(', ', $sets);
                    $values[] = $docId;

                    $query = "UPDATE ms_dok SET $setStr WHERE nm_zp = ?";
                    $stmt = $conn->prepare($query);
                    $stmt->execute($values);

                    $response['success'] = true;
                    $response['data'] = [
                        'id' => $docId,
                        'message' => 'Document updated'
                    ];
                    break;

                case 'DELETE':
                    // Delete document
                    if (!$docId) {
                        throw new Exception('Document ID required');
                    }

                    $stmt = $conn->prepare("DELETE FROM ms_dok WHERE nm_zp = ?");
                    $stmt->execute([$docId]);

                    $response['success'] = true;
                    $response['data'] = [
                        'id' => $docId,
                        'message' => 'Document deleted'
                    ];
                    break;

                case 'GET':
                    // Get document(s)
                    if ($docId) {
                        $stmt = $conn->prepare("SELECT nm_zp as kd_d, kd_dk as code, dt_dk as date, kd_ps as supplier, text as comment FROM ms_dok WHERE nm_zp = ?");
                        $stmt->execute([$docId]);
                        $response['data'] = $stmt->fetch();
                    } else {
                        $stmt = $conn->prepare("SELECT nm_zp as kd_d, kd_dk as code, dt_dk as date, kd_ps as supplier, text as comment FROM ms_dok LIMIT 100");
                        $stmt->execute();
                        $response['data'] = $stmt->fetchAll();
                    }
                    $response['success'] = true;
                    break;
            }
        }
        // /api/ref/{table} or /api/ref/{table}/{id}
        else if (isset($parts[2]) && $parts[2] === 'ref') {
            $refTable = $parts[3] ?? null;
            $refId = $parts[4] ?? null;

            if (!$refTable) {
                throw new Exception('Reference table name required');
            }

            switch ($method) {
                case 'POST':
                    // Create reference
                    if (!$input) {
                        throw new Exception('No data provided');
                    }

                    $columns = array_keys($input);
                    $placeholders = array_fill(0, count($columns), '?');
                    $columnStr = implode(', ', $columns);
                    $placeholderStr = implode(', ', $placeholders);

                    $query = "INSERT INTO $refTable ($columnStr) VALUES ($placeholderStr)";
                    $stmt = $conn->prepare($query);
                    $stmt->execute(array_values($input));

                    $response['success'] = true;
                    $response['data'] = [
                        'id' => $conn->lastInsertId(),
                        'message' => 'Reference created'
                    ];
                    break;

                case 'PUT':
                    // Update reference
                    if (!$refId || !$input) {
                        throw new Exception('Reference ID and data required');
                    }

                    // Guess primary key (kd_ps, kd_im, kd_sk, etc.)
                    $pkPrefix = substr($refTable, 3); // Remove 'spr' prefix
                    $pkColumn = "kd_$pkPrefix";

                    $sets = [];
                    foreach ($input as $key => $value) {
                        $sets[] = "$key = ?";
                    }
                    $setStr = implode(', ', $sets);
                    $values = array_values($input);
                    $values[] = $refId;

                    $query = "UPDATE $refTable SET $setStr WHERE $pkColumn = ?";
                    $stmt = $conn->prepare($query);
                    $stmt->execute($values);

                    $response['success'] = true;
                    $response['data'] = [
                        'id' => $refId,
                        'message' => 'Reference updated'
                    ];
                    break;

                case 'DELETE':
                    // Delete reference
                    if (!$refId) {
                        throw new Exception('Reference ID required');
                    }

                    $pkPrefix = substr($refTable, 3);
                    $pkColumn = "kd_$pkPrefix";

                    $stmt = $conn->prepare("DELETE FROM $refTable WHERE $pkColumn = ?");
                    $stmt->execute([$refId]);

                    $response['success'] = true;
                    $response['data'] = [
                        'id' => $refId,
                        'message' => 'Reference deleted'
                    ];
                    break;

                case 'GET':
                    // Get reference(s)
                    if ($refId) {
                        $pkPrefix = substr($refTable, 3);
                        $pkColumn = "kd_$pkPrefix";
                        $stmt = $conn->prepare("SELECT * FROM $refTable WHERE $pkColumn = ?");
                        $stmt->execute([$refId]);
                        $response['data'] = $stmt->fetch();
                    } else {
                        $stmt = $conn->prepare("SELECT * FROM $refTable LIMIT 100");
                        $stmt->execute();
                        $response['data'] = $stmt->fetchAll();
                    }
                    $response['success'] = true;
                    break;
            }
        }
        else {
            $response['error'] = 'Invalid API endpoint';
        }
    }
    else {
        $response['error'] = 'No action or valid endpoint specified';
    }

} catch (Exception $e) {
    $response['error'] = $e->getMessage();
    error_log('API Error: ' . $e->getMessage());
    http_response_code(400);
}

// Send response
echo json_encode($response);
exit;
