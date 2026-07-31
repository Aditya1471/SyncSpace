import mongoose from "mongoose";
import bcrypt from "bcryptjs";


const userSchema = new mongoose.Schema(
  {

    // ==============================
    // BASIC INFORMATION
    // ==============================

    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
      minlength: 3,
      maxlength: 50,
    },


    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      lowercase: true,
      trim: true,
      minlength: 3,
      maxlength: 30,
    },


    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },


    // ==============================
    // AUTHENTICATION
    // ==============================

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
      select: false,
    },


    // ==============================
    // PROFILE
    // ==============================

    avatar: {
      type: String,
      default: "",
    },


    bio: {
      type: String,
      default: "",
      maxlength: 200,
    },


    github: {
      type: String,
      default: "",
    },


    // ==============================
    // USER ROLE
    // ==============================

    role: {
      type: String,
      enum: [
        "user",
        "admin",
      ],
      default: "user",
    },


    // ==============================
    // ACCOUNT STATUS
    // ==============================

    isActive: {
      type: Boolean,
      default: true,
    },


    isVerified: {
      type: Boolean,
      default: false,
    },


    // ==============================
    // SOCKET.IO PRESENCE
    // ==============================

    isOnline: {
      type: Boolean,
      default: false,
    },


    socketId: {
      type: String,
      default: null,
    },


    lastSeen: {
      type: Date,
      default: Date.now,
    },


    // ==============================
    // EMAIL VERIFICATION
    // ==============================

    verificationToken: {
      type: String,
      default: null,
    },


    verificationExpire: {
      type: Date,
      default: null,
    },


    // ==============================
    // PASSWORD RESET
    // ==============================

    resetPasswordToken: {
      type: String,
      default: null,
    },


    resetPasswordExpire: {
      type: Date,
      default: null,
    },


  },
  {
    timestamps: true,


    // Remove sensitive data automatically

    toJSON: {
      virtuals: true,

      transform(doc, ret){

        delete ret.password;
        delete ret.resetPasswordToken;
        delete ret.resetPasswordExpire;
        delete ret.verificationToken;

        return ret;

      },
    },

  }
);



// ===================================================
// PASSWORD HASHING
// ===================================================


userSchema.pre(
  "save",
  async function(next){

    if(!this.isModified("password")){
      return next();
    }


    const salt =
      await bcrypt.genSalt(10);


    this.password =
      await bcrypt.hash(
        this.password,
        salt
      );


    next();

  }
);



// ===================================================
// PASSWORD COMPARE
// ===================================================


userSchema.methods.matchPassword =
async function(password){

  return await bcrypt.compare(
    password,
    this.password
  );

};



// ===================================================
// SOCKET ONLINE STATUS
// ===================================================


userSchema.methods.goOnline =
async function(socketId){

  this.isOnline = true;
  this.socketId = socketId;
  this.lastSeen = new Date();


  await this.save();

};



userSchema.methods.goOffline =
async function(){

  this.isOnline = false;
  this.socketId = null;
  this.lastSeen = new Date();


  await this.save();

};



// ===================================================
// DATABASE INDEXES
// ===================================================


userSchema.index({
  email: 1,
});


userSchema.index({
  username: 1,
});


userSchema.index({
  isOnline: 1,
});



// ===================================================
// EXPORT
// ===================================================


const User = mongoose.model(
  "User",
  userSchema
);


export default User;