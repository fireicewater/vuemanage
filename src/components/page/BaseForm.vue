<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 个人信息</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <el-row :gutter="20">
            <el-col :span="12">
                <el-form :model="creatform" ref="creatform" :rules="createformrules" label-width="80px">
                    <el-input v-model="creatform.id" type="hidden"></el-input>
                    <el-form-item label="用户名" prop="username">
                        <el-input v-model="creatform.username" :disabled="true"></el-input>
                    </el-form-item>
                    <el-form-item label="姓名" prop="name">
                        <el-input v-model="creatform.name"></el-input>
                    </el-form-item>
                    <el-form-item label="性别" prop="sex">
                        <el-radio-group v-model="creatform.sex">
                            <el-radio label="1">男</el-radio>
                            <el-radio label="2">女</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="手机" prop="mobile">
                        <el-input v-model="creatform.mobile"></el-input>
                    </el-form-item>
                    <el-form-item label="支付方式" prop="paymethod">
                        <el-input v-model="creatform.paymethod"></el-input>
                    </el-form-item>
                    <el-form-item label="银行卡号" prop="cardno">
                        <el-input v-model="creatform.cardno"></el-input>
                    </el-form-item>
                    <el-form-item label="支付宝" prop="alipay">
                        <el-input v-model="creatform.alipay"></el-input>
                    </el-form-item>
                    <el-form-item label="销售金额" prop="salesamount">
                        <el-input v-model="creatform.salesamount"></el-input>
                    </el-form-item>
                    <el-form-item label="销售人员" prop="salesman">
                        <el-input v-model="creatform.salesman"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="onSubmit">修改</el-button>
                        <el-button type="primary" class="handle-del mr10" @click="changepassword">修改密码</el-button>
                        <el-button type="primary" class="handle-del mr10" @click="referrerbottom">销售情况</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
            <el-col :span="12">
                <el-table :data="remittancetable" style="width: 100%" :row-class-name="tableRowClassName">
                    <el-table-column prop="createtime" label="日期" sortable :formatter="formatter">></el-table-column>
                    <el-table-column prop="amount" label="金额" sortable></el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button size="mini" @click="confirmamount(scope.$index, scope.row)"
                                       :disabled="scope.row.status">
                                确认
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-col>
        </el-row>
        <el-dialog title="修改密码" :visible.sync="changePassowrdFormVisible">
            <el-form :model="changpasswordform" :rules="changpasswordrules" ref="changpasswordform">
                <el-input v-model="changpasswordform.id" type="hidden"></el-input>
                <el-form-item label="原密码" prop="password">
                    <el-input type="password" v-model="changpasswordform.password"></el-input>
                </el-form-item>
                <el-form-item label="新密码" prop="newpassword">
                    <el-input type="password" v-model="changpasswordform.newpassword"></el-input>
                </el-form-item>
                <el-form-item label="重复密码" prop="repassword">
                    <el-input type="password" v-model="changpasswordform.repassword"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="changpasswordcancel">取 消</el-button>
                <el-button type="primary" @click="changpasswordconfirm">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog title="销售分成" :visible.sync="referrervisable">
            <el-table :data="refertable" style="width: 100%">
                <el-table-column prop="username" label="用户名"></el-table-column>
                <el-table-column prop="salesamount" label="金额"></el-table-column>
            </el-table>
        </el-dialog>
    </div>
</template>

<script>
    import auth from "../../auth"

    export default {
        data: function () {
            var validateoriginalpassword = (rule, value, callback) => {
                this.$http.post("/user/validatpassword", {
                    userid: this.userid,
                    password: value
                }, {emulateJSON: true})
                    .then(response => {
                        let code = response.body.code;
                        if (code === 404) {
                            callback(new Error('密码输入错误'));
                        } else {
                            callback();
                        }
                    }, response => {
                        callback();
                    })

            };
            const validateNewpassword = (rule, value, callback) => {
                let pasword = this.changpasswordform.password;
                if (pasword == value) {
                    callback(new Error('原密码不能和新密码一样'));
                } else {
                    callback();
                }
            };
            const validaterepassword = (rule, value, callback) => {
                let newpasword = this.changpasswordform.newpassword;
                if (newpasword != value) {
                    callback(new Error('两次输的密码必须一样'));
                } else {
                    callback();
                }
            };
            return {
                creatform: {
                    id: null,
                    username: "",
                    password: "",
                    name: "",
                    sex: "1",
                    mobile: "",
                    paymethod: "",
                    cardno: "",
                    alipay: "",
                    salesamount: '',
                    salesman: ""
                },
                referrervisable: false,
                changpasswordform: {
                    id: null,
                    password: "",
                    newpassword: "",
                    repassword: ""
                },
                refertable: [],
                createformrules: {
                    name: [
                        {type: "string", required: true, message: '请输入姓名', trigger: 'blur'},
                    ],
                    mobile: [
                        {required: true, message: '请输入手机号', trigger: 'blur'},
                        {
                            pattern: /^[1][3,4,5,7,8][0-9]{9}$/,
                            message: '请输入正确手机号',
                            trigger: 'blur'
                        },
                    ],
                    paymethod: [
                        {type: "string", required: true, message: '请输入支付方式', trigger: 'blur'},
                    ],
                    cardno: [
                        {type: "string", required: true, message: '请输入银行卡号', trigger: 'blur'},
                    ],
                    alipay: [
                        {type: "string", required: true, message: '请输入银支付宝号', trigger: 'blur'},
                    ],
                    salesamount: [
                        {type: "string", required: true, message: '请输入购买金额', trigger: 'blur'},
                        {
                            pattern: /^(([1-9][0-9]*)|(([0]\.\d{0,2}|[1-9][0-9]*\.\d{0,2})))$/,
                            message: '请输入正确金额',
                            trigger: 'blur'
                        },
                    ],
                    salesman: [
                        {type: "string", required: true, message: '请输入销售人员信息', trigger: 'blur'},
                    ]
                },
                changpasswordrules: {
                    password: [
                        {type: "string", required: true, message: '请输入原密码', trigger: 'blur'},
                        {validator: validateoriginalpassword, trigger: 'blur'}
                    ],
                    newpassword: [
                        {type: "string", required: true, message: '请输入新密码', trigger: 'blur'},
                        {validator: validateNewpassword, trigger: 'blur'}
                    ],
                    repassword: [
                        {type: "string", required: true, message: '请输入新密码', trigger: 'blur'},
                        {validator: validaterepassword, trigger: 'blur'}
                    ]
                },
                changePassowrdFormVisible: false,
                remittancetable: [],
                userid: 0
            }
        },
        methods: {
            onSubmit() {
                this.$refs['creatform'].validate((valid) => {
                    let creat = this.creatform;
                    if (valid) {
                        this.$http.put("/user/updateuser", creat).then(response => {
                            if (response.status === 200) {
                                let code = response.body.code;
                                if (code === 200) {
                                    this.$message.success('提交成功！');
                                    this.getData();
                                }
                                if (code === 500) {
                                    this.$message.error('修改失败,请稍后重试');
                                }
                                if (code === 403) {
                                    this.$message.error('校验未通过');
                                }
                            }
                        }, response => {
                            this.$message.error("服务器错误请稍后再试");
                        });
                    } else {
                        this.$message.error("校验未通过");
                        return false;
                    }
                });

            },
            changepassword() {
                this.changpasswordform = {};
                let id = this.creatform.id;
                this.changpasswordform.id = id;
                this.changePassowrdFormVisible = true;
            },
            changpasswordcancel() {
                this.changpasswordform = {};
                this.changePassowrdFormVisible = false;
            },
            changpasswordconfirm() {
                this.$refs.changpasswordform.validate((valid) => {
                    if (valid) {
                        this.$http.post("/user/changpassword", this.changpasswordform)
                            .then(response => {
                                let code = response.body.code;
                                if (code === 200) {
                                    this.$message.success('修改成功！');
                                    this.changePassowrdFormVisible = false;
                                    this.$refs.changpasswordform.resetFields();
                                    this.changpasswordform = {};
                                }
                                if (code === 500) {
                                    this.$message.error('修改失败,请稍后重试');
                                }
                                if (code === 403) {
                                    this.$message.error('校验未通过');
                                }
                            }, response => {
                                this.$message.error("服务器错误请稍后再试");
                            })
                    } else {
                        this.$message.error("校验未通过");
                        return false;
                    }
                })

            },
            tableRowClassName(row, rowIndex) {
                if (row.status) {
                    return 'success-row';
                }
                return '';
            },
            confirmamount(index, row) {
                let amount = row;
                this.$http.put("/amount/updatestatus", amount)
                    .then(response => {
                        let code = response.body.code;
                        if (code === 200) {
                            this.$message.success('确认金额成功！');
                            this.getAmountData();
                        }
                        if (code === 500) {
                            this.$message.error('确认失败,请稍后重试');
                        }
                    }, response => {
                        this.$message.error("服务器错误请稍后再试")
                    });

            },
            getData() {
                this.$http.get("/user/getuserinfo", {
                    params: {
                        userid: this.userid
                    }
                }).then(response => {
                    let code = response.body.code;
                    if (code === 200) {
                        let userinfo = response.body.body;
                        userinfo.sex = userinfo.sex.toString();
                        userinfo.salesamount = userinfo.salesamount.toString();
                        this.creatform = userinfo;
                    }
                }, response => {

                })
            },
            getAmountData() {
                this.$http.get("/amount/getAmounts", {
                    params: {
                        userid: this.userid
                    }
                }).then(response => {
                    let code = response.body.code;
                    if (code === 200) {
                        let remittancetable = response.body.body;
                        this.remittancetable = remittancetable;
                    }
                }, response => {

                })
            },
            formatter(row, column) {
                let data = new Date(row.createtime);
                var year = data.getFullYear();
                var month = data.getMonth() + 1;
                var date = data.getDate();
                return [year, month, date].join('-');
            },
            referrerbottom() {
                console.log(this.creatform.username);
                this.$http.get("/user/getreferrer", {
                    params: {
                        username: this.creatform.username
                    }
                }).then(response => {
                    let code = response.body.code;
                    if (code === 200) {
                        let referrs = response.body.body;
                        this.refertable = referrs;
                        this.referrervisable = true;
                    }
                }, response => {

                })
            }
        },
        created() {
            this.userid = sessionStorage.getItem('userid');
            // this.userid = 5;
            this.getData();
            this.getAmountData();
        },
        http: {
            root: '/root',
            headers: auth.getAuthHeader()
        }
    }
</script>
<style>
    .el-table .success-row {
        background: #f0f9eb;
    }
</style>
