In the terminal window, run this command to generate the key and certificate.

```
openssl req -x509 \
  -out ssl-localhost/localhost.crt \
  -keyout ssl-localhost/localhost.key \
  -newkey rsa:2048 -nodes -sha256 -days 365 \
  -config localhost.conf
```

| Argument                            | Description                                                  |
| ----------------------------------- | ------------------------------------------------------------ |
| req -x509                           | generate X.509 certificate                                   |
| -out ssl-localhost/localhost.crt    | name of output certificate file                              |
| -keyout ssl-localhost/localhost.key | name of output key file                                      |
| -newkey rsa:2048                    | create new certificate request and a new private key using algorithm RSA and key size of 2048 bits |
| -nodes                              | No DES encryption. The generated private key will not be encrypted |
| -sha256                             | Use the SHA256 message digest to sign the request            |
| -days 365                           | Certificate is valid for 365 days                            |
| -config localhost.conf              | Name of config file                                          |


1. Move into the directory of your Spring Boot library project.

   ```
   cd spring-boot-library
   ```



2. In the terminal window, run this command to generate the key and certificate. This is one long command, copy/paste in its entirety.

   ```
   keytool -genkeypair -alias ElvisLibrary -keystore src/main/resources/library-keystore.p12 -keypass secret -storeType PKCS12 -storepass secret -keyalg RSA -keysize 2048 -validity 365 -dname "C=CN, ST=Hong Kong Special Administrative Region, L=Hong Kong, O=ElvisLUK, OU=Training Backend, CN=localhost" -ext "SAN=dns:localhost"
   ```



| Argument    | Description                        |
   | ----------- | ---------------------------------- |
| -genkeypair | Generates a key pair               |
| -alias      | Alias name of the entry to process |
| -keystore   | Name of output keystore file       |
| -keypass    | Key password                       |
| -storeType  | Keystore type                      |
| -storepass  | Keystore password                  |
| -keyalg     | Key algorithm name                 |
| -keysize    | Key bit size                       |
| -validity   | Validity number of days            |
| -dname      | Distinguished name                 |
| -ext        | Add the given X.509 extension      |

