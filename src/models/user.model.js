'use strict'

/** User Schema */

const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const {ROLE_VALUES, ROLES, AUTH} = require('../config/constants')

const userSchema = new mongoose.Schema(
    {
        name:{
            type:String,
            required:[true, 'name required'],
            trim:true,
            maxlength:[60, 'name cannot exceed 60 characters']
        },
        email:{
            type:String,
            required:[true, 'email required'],
            unique:true,
            lowercase:true,
            trim:true,
            match:[/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'please provide a valid email']
        },
        password:{
            type:String,
            required:[true, 'password required'],
            minlength:[8, 'password must be at least 8 characters long'],
            select: false
        },
        role:{
            type:String,
            enum:{values:ROLE_VALUES, message:`{Value} is not a valid role`},
            default: ROLES.USER,
        }
    }, {
        timestamps:true,
        toJSON:{
            virtuals:true,
            versionKey:false,
            transform(doc, ret){
                ret.id = ret._id
                delete ret._id
                delete ret.password
                return ret
            }
        },
        toObject:{virtuals:true}
    }
)

userSchema.pre('save', async function hashPassword(){
    if(!this.isModified('password')) return

    this.password = await bcrypt.hash(this.password, AUTH.SALT_ROUNDS)
})


userSchema.methods.comparePassword = function comparePassword(candidatePassword){
    return bcrypt.compare(candidatePassword, this.password)
}

module.exports = mongoose.model('User', userSchema)