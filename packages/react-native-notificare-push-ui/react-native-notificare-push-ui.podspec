require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))

Pod::Spec.new do |s|
  s.name         = "react-native-notificare-push-ui"
  s.version      = package["version"]
  s.summary      = package["description"]
  s.homepage     = package["homepage"]
  s.license      = package["license"]
  s.authors      = package["author"]

  s.platforms    = { :ios => "10.0" }
  s.swift_version = '5.0'

  s.source       = { :git => "https://github.com/notificare/notificare-sdk-react-native.git", :tag => "#{s.version}" }
  s.source_files = "ios/**/*.{h,m,mm,swift}"

  s.dependency 'React-Core'
  s.dependency 'Notificare/NotificareKit', '3.4.0-beta.2'
  s.dependency 'Notificare/NotificarePushUIKit', '3.4.0-beta.2'
end
