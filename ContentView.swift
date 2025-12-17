import SwiftUI

struct ContentView: View {
    @State var email = ""
    @State var password = ""
    @State var userId = 0
    @State var logged = false

    var body: some View {
        VStack {
            if logged {
                Button("CHECK IN") { send("checkin") }
                Button("CHECK OUT") { send("checkout") }
            } else {
                TextField("Email", text: $email)
                SecureField("Password", text: $password)
                Button("Login") { login() }
            }
        }.padding()
    }

    func login() {
        let url = URL(string: "http://localhost:3000/login")!
        var r = URLRequest(url: url)
        r.httpMethod = "POST"
        r.httpBody = try! JSONEncoder().encode([
            "email": email,
            "password": password
        ])
        r.addValue("application/json", forHTTPHeaderField: "Content-Type")

        URLSession.shared.dataTask(with: r) { d,_,_ in
            if let d = d,
               let json = try? JSONSerialization.jsonObject(with: d) as? [String:Any] {
                DispatchQueue.main.async {
                    userId = json["id"] as! Int
                    logged = true
                }
            }
        }.resume()
    }

    func send(_ type: String) {
        let url = URL(string: "http://localhost:3000/\(type)")!
        var r = URLRequest(url: url)
        r.httpMethod = "POST"
        r.httpBody = try! JSONEncoder().encode([
            "user_id": userId
        ])
        r.addValue("application/json", forHTTPHeaderField: "Content-Type")
        URLSession.shared.dataTask(with: r).resume()
    }
}
