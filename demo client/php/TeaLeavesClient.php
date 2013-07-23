<?php # /src/TeaLeaves/Client.php

namespace TeaLeaves;

class Client
{
	private $appKey;
	private $appSecret;
	private $host;
	private $apiVersion;
	private $errors = [];
	
	public function __construct($cfg)
	{
		if (!isset($cfg['app_key'])||!isset($cfg['app_secret'])) {
			// throw credentials error
		} else {
			$this->appKey = $cfg['app_key'];
			$this->appSecret = $cfg['app_secret'];
		}
		
		if (!isset($cfg['host'])) {
			// throw server error
		} else {
			$this->host = $cfg['host'];
		}
		
		if (!isset($cfg['api_version'])) {
			$this->apiVersion = '1'; // current version
		} else {
			$this->apiVersion = $cfg['api_version'];
		}
	}
	
	public function notify($msg)
	{
		$endpoint = "/api/v{$this->apiVersion}/{$this->appKey}/notify.json";
		
		// the server generates the signature off string values
		$message = [
			'description' => (string) $msg['description'],
			'details' => (string) $msg['details'],
			'file' => (string) $msg['file'],
			'line_number' => (string) $msg['line_number']
		];
		
		$message['extra'] = isset($msg['extra'])? $msg['extra'] : '';
		
		$signature = $this->_signRequest(json_encode($message, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES));
		
		$serverResponse = $this->_curlRequest($endpoint, 'POST', [
			'message' => $message,
			'signature' => $signature
		]);
		
		if (!$serverResponse) {
			return false;
		}
		
		if ($serverResponse->status == 'complete') {
			return true;
		} else {
			$this->_handleAppError($serverResponse);
			return false;
		}
	}
	
	public function getLeaves()
	{
		$endpoint = "/api/v{$this->apiVersion}/{$this->appKey}/leafs.json";
		
		$oneTimeCode = $this->_secureRandomHex();
		
		$signature = $this->_signRequest($oneTimeCode);
		
		$serverResponse = $this->_curlRequest($endpoint, 'GET', [
			'code' => $oneTimeCode,
			'signature' => $signature
		]);
		
		if (!$serverResponse) {
			return false;
		}
		
		if (isset($serverResponse->leafs)) {
			return $serverResponse->leafs;
		} else {
			$this->_handleAppError($serverResponse);
			return false;
		}
	}
	
	private function _curlRequest($endpoint, $method = 'GET', $data = [])
	{
		$url = $this->_url($endpoint);
		
		// open connection
		$ch = curl_init();
		
		if ($method == 'POST') {
			// setup a post operation
			curl_setopt($ch, CURLOPT_POST, true);
			curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($data));
		} else {
			// assume GET
			if (!empty($data)) {
				// encode the data
				$url .= '?' . http_build_query($data);
			}
		}
		
		//var_dump($url);
		
		// capture the response
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
		
		// set the url
		curl_setopt($ch, CURLOPT_URL, $url);
		
		if (!$result = curl_exec($ch)) {
			$this->errors = [
				'cURL Error' => curl_error($ch)
			];
			
			return false;
		}
		
		$response = json_decode($result);
		
		//var_dump($response);
		
		// grab the server's responding HTTP code
		$responseCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
		
		//var_dump($responseCode);
		
		// close the connection
		curl_close($ch);
		
		if ((int) $responseCode != 200) {
			$this->_handleResponseError($responseCode);
			
			return false;
		} else {
			return $response;
		}
	}
	
	private function _signRequest($message)
	{
		return hash_hmac('sha256', $message, $this->appSecret);
	}
	
	private function _secureRandomHex($len = 16)
	{
		return bin2hex( openssl_random_pseudo_bytes($len) );
	}
	
	private function _url($endpoint)
	{
		$base = '';
		
		if (isset($this->host['https']) and $this->host['https'] == true) {
			$base .= 'https://';
		} else {
			$base .= 'http://';
		}
		
		$base .= $this->host['address'];
		
		if (isset($this->host['port'])) {
			$base .= ':' . $this->host['port'];
		}
		
		return $base . $endpoint;
	}
	
	/* 
	 * Error Handling - if an error occurs with the request
	 * the API function will return false and $this->errors
	 * will be populated.  You can call getErrors() to
	 * retrieve the error messages.
	 */
	private function _handleResponseError($responseCode = 0)
	{
		$this->errors = [];
		
		switch ($responseCode) {
			
			case 403: // Not Authorized
				$this->errors['NotAuthorized'] = 'Your App Credentials are not valid.';
				break;
			
			case 404: // App not found
				$this->errors['NotFound'] = 'The requested App was not found.';
				break;
			
			case 409: // Unsupported Format
				$this->errors['BadFormat'] = 'The requested format is not supported';
				break;
			
			case 500: // Server went BOOM!
				$this->errors['ServerError'] = 'An error occured on the server.';
				break;
			
			default:
				$this->errors['Default'] = 'An unspecified error occurred.';
		}
	}
	
	private function _handleAppError($serverResponse)
	{
		$this->error = [
			'AppError' => $serverResponse->message
		];
	}
	
	public function getErrors()
	{
		return $this->errors;
	}
}
