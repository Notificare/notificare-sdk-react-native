require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))
notificare_version = '3.10.0'

Pod::Spec.new do |s|
  s.name         = "react-native-notificare"
  s.version      = package["version"]
  s.summary      = package["description"]
  s.homepage     = package["homepage"]
  s.license      = package["license"]
  s.authors      = package["author"]

  s.platforms    = { :ios => "13.0" }
  s.swift_version = '5.0'

  s.source       = { :git => "https://github.com/notificare/notificare-sdk-react-native.git", :tag => "#{s.version}" }
  s.source_files = "ios/**/*.{h,m,mm,swift}"

  s.dependency 'React-Core'
  s.dependency 'Notificare/NotificareKit', notificare_version
end
