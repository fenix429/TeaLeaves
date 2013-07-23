<?php
//error_reporting(0);

require('TeaLeavesClient.php');

function error_handler($code, $message, $file, $line)
{
	throw new ErrorException($message, 0, $code, $file, $line);
}

function exception_handler($e)
{
	try {
		$tealeaves = new TeaLeaves\Client([
			'app_key' => 'ce405bde12ff6b9aa62fcf721e8ff166',
			'app_secret' => '9fa2a824ca0b955637d22dab2377b982',
			'host' => [
				'address' => '127.0.0.1',
				'port' => '9393'
			]
		]);
		
		if(!$tealeaves->notify([
			'description' => $e->getMessage(),
			'details' => $e->getTraceAsString(),
			'file' => $e->getFile(),
			'line_number' => $e->getLine(),
			'extra' => 'The exception code is: ' . $e->getCode()
		])) {
			// in a real app we could log the exception along with getErrors() here...
			echo "Not OK \n";
			var_dump( $tealeaves->getErrors() );
		} else {
			echo "OK!\n";
		}
		
	} catch (Exception $e) {
		// This will catch Exceptions or Errors raised within the handler
	}
}
set_error_handler('error_handler');
set_exception_handler('exception_handler');

throw new Exception('Ohhhh Nooos! we go boom');

