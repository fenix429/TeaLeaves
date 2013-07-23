require 'openssl'
require 'yaml'
require 'rubygems' if RUBY_VERSION < "1.9"
require 'bundler'

Bundler.require

# Load the application files
dir = File.dirname(__FILE__)
require dir + '/classes_and_overrides.rb'
Dir[dir + '/models/*'].each { |file| require file }
Dir[dir + '/controllers/*'].each { |file| require file }
require dir + '/application'

run TeaLeaves::Application