# Eventora Deployment Guide
## Backend → Render (Free) | Frontend → Vercel (Free)

---

## STEP 0: Gmail App Password Banana (OTP ke liye ZAROORI)

> ⚠️ Yahi sabse important step hai. Agar ye nahi kiya toh OTP kaam nahi karega.

1. **Gmail Account mein jao** → https://myaccount.google.com
2. **Security** tab open karo
3. **2-Step Verification** enable karo (agar nahi hai toh pehle karo)
4. Wapas Security > neeche scroll karo → **App passwords** dhundo
5. App passwords page pe:
   - App: `Mail`
   - Device: `Other (Custom name)` → "Eventora" likho
   - **Generate** karo
6. **16-character password** milega jaise: `abcd efgh ijkl mnop`
   - Isko copy karke rakh lo — yahi `EMAIL_PASS` hai
   - Apni Gmail login password use mat karo

---

## STEP 1: MongoDB Atlas (Free Database)

1. https://cloud.mongodb.com pe account banao
2. **New Project** → "Eventora"
3. **Create Deployment** → **M0 Free Tier** choose karo
4. Username/password set karo (yaad rakh lo)
5. **Network Access** → **Add IP Address** → `0.0.0.0/0` (sab allow karo)
6. **Connect** → **Drivers** → connection string copy karo:
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/eventora
   ```

---

## STEP 2: Backend Deploy (Render - Free)

1. https://render.com pe account banao
2. **New** → **Web Service**
3. GitHub repo connect karo (ya manual deploy)
   - Root directory: `server`
   - Build Command: `npm install`
   - Start Command: `npm start`
4. **Environment Variables** add karo:
   ```
   MONGO_URI      = mongodb+srv://...  (Atlas se)
   JWT_SECRET     = koi_bhi_random_strong_string_64chars
   EMAIL_USER     = tumhara@gmail.com
   EMAIL_PASS     = abcd efgh ijkl mnop  (App Password)
   FRONTEND_URL   = https://eventora.vercel.app  (baad mein update karna)
   PORT           = 5000
   ```
5. **Deploy** karo
6. Render tumhe ek URL dega jaise: `https://eventora-backend.onrender.com`
   - Isko copy karke rakh lo

> ⚠️ Free Render service 15 min inactivity ke baad sleep ho jaati hai.
> Pehli request pe 30-50 seconds lag sakte hain wake up hone mein.

---

## STEP 3: Frontend Deploy (Vercel - Free)

1. https://vercel.com pe account banao
2. **New Project** → GitHub repo connect karo
   - Root directory: `client`
   - Framework: **Vite**
   - Build command: `npm run build`
   - Output directory: `dist`
3. **Environment Variables** add karo:
   ```
   VITE_API_URL = https://eventora-backend.onrender.com/api
   ```
   (Render ka URL jo Step 2 mein mila)
4. **Deploy** karo
5. Vercel tumhe URL dega jaise: `https://eventora.vercel.app`

---

## STEP 4: CORS Fix (Backend update karo)

Ab Vercel URL mila hai, Render pe jao:

1. Render Dashboard → Eventora service → **Environment**
2. `FRONTEND_URL` ko update karo:
   ```
   FRONTEND_URL = https://eventora.vercel.app
   ```
3. **Save** karo — Render automatically redeploy karega

---

## Testing

1. Vercel URL open karo
2. Register karo ek nayi email se
3. OTP aana chahiye Gmail pe (spam folder bhi check karo)
4. OTP enter karo → login hona chahiye ✅

---

## Agar OTP phir bhi na aaye?

Render logs check karo:
- Render Dashboard → Service → **Logs**
- `Email server is ready` dikhna chahiye
- Koi error hai toh: EMAIL_USER aur EMAIL_PASS dobara check karo
- App Password mein spaces ho toh bhi theek hai (Render unhe accept karta hai)

