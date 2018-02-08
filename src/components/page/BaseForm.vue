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
                        <el-button type="primary" @click="">修改</el-button>
                        <el-button type="primary" class="handle-del mr10" @click="changepassword">修改密码</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
            <el-col :span="12">
                <el-table :data="remittancetable" style="width: 100%" :row-class-name="tableRowClassName">
                    <el-table-column prop="date" label="日期" sortable></el-table-column>
                    <el-table-column prop="amount" label="金额" sortable></el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button size="mini" @click="confirmamount(scope.$index, scope.row)">
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
    </div>
</template>

<script>
    export default {
        data: function () {
            var validateNewpassword = (rule, value, callback) => {
                const pasword = this.changpasswordform.password;
                if (pasword == value) {
                    callback(new Error('原密码不能和新密码一样'));
                } else {
                    callback();
                }
            };
            var validaterepassword = (rule, value, callback) => {
                const newpasword = this.changpasswordform.newpassword;
                if (newpasword != value) {
                    callback(new Error('两次输的密码必须一样'));
                } else {
                    callback();
                }
            };
            return {
                creatform: {
                    id: 564645664,
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
                changpasswordform: {
                    id: null,
                    password: "",
                    newpassword: "",
                    repassword: ""
                },
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
                remittancetable: []
            }
        },
        methods: {
            onSubmit() {

                this.$message.success('提交成功！');
            },
            changepassword() {
                this.changpasswordform = {};
                const id = this.creatform.id;
                this.changpasswordform.id = id;
                this.changePassowrdFormVisible = true;
            },
            changpasswordcancel() {
                this.changpasswordform = {};
                this.changePassowrdFormVisible = false;
            },
            changpasswordconfirm() {
                //TODO 后台提交
                this.$message.success('修改成功！');
                this.changePassowrdFormVisible = false;

            },
            tableRowClassName(row, rowIndex) {
                if (row.status === 1) {
                    return 'success-row';
                }
                return '';
            },
            confirmamount(index, row) {
                this.message.success("确认金额成功");
            }
        },
        created() {
            this.remittancetable = [
                {
                    id: 1,
                    date: "2017-10-1",
                    amount: 100,
                    status: 0
                },
                {
                    id: 2,
                    date: "2017-10-1",
                    amount: 200,
                    status: 1
                }
            ]
        }
    }
</script>
<style>
    .el-table .success-row {
        background: #f0f9eb;
    }
</style>
