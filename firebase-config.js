<script type="module">
  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-analytics.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyD_tulsSjZTB0F0ya34N2XUD67a77BTWpw",
    authDomain: "wine-f57cb.firebaseapp.com",
    projectId: "wine-f57cb",
    storageBucket: "wine-f57cb.firebasestorage.app",
    messagingSenderId: "172638778743",
    appId: "1:172638778743:web:85045c1b2eeefeb2c11d72",
    measurementId: "G-6D6L2W94D6"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
</script>
