<template>
    <el-select
        :value="scope.value"
        :clearable="clearable"
        :multiple="multiple"
        @remove-tag="handleRemoveTag"
        @visible-change="visibleChange"
        @clear="clearHandle">
        <el-tree
            id="tree-option"
            ref="selectTree"
            class="tree-select"
            :show-checkbox="multiple"
            :accordion="accordion"
            :data="scope.options"
            :props="props"
            :node-key="props.value"
            :default-expanded-keys="defaultExpandedKey"
            @check="handleCheck">
            <!-- 自定义节点 title -->
            <el-option
                :key="data[props.value]"
                slot-scope="{ node, data }"
                :label="node.label"
                :value="data[props.value]"
                @click.native="handleNodeClick(node,  data)" ></el-option>
        </el-tree>
    </el-select>
</template>

<script>
/**
 * @version:                2019.11.06
 * @createTime:             2019.11.06
 * @updateTime:             2019.11.06
 * @author:                 huazq
 * @description             tree-select
 *                          详细说明看注释  !important
 */
export default {
    name: 'ElTreeSelect',
    props: {
        // 配置项
        props: {
            type: Object,
            default: () => {
                return {
                    value: 'classCode', // ID字段名
                    label: 'title', // 显示名称
                    children: 'children' // 子级字段名
                };
            }
        },

        // 选项列表数据(树形结构的对象数组)
        options: {type: Array, default: []},

        // 初始值
        value: {type: [Number, String, Array], default: null},

        // 可清空选项
        clearable: {type: Boolean, default: true},

        // 自动收起
        accordion: {type: Boolean, default: false},

        // 是否多选
        multiple: {type: Boolean, default: false}
    },
    data() {
        return {
            //  组件内部的数据
            scope: {
                value: this.value,
                options: this.options
            },
            defaultExpandedKey: []
        };
    },
    watch: {
        //  监听tree数据
        options: {
            immediate: true,
            deep: true,
            handler(newVal) {
                if (newVal && newVal.length) this.scope.options = JSON.parse(JSON.stringify(newVal));
            }
        },
        //  监听value
        value: {
            immediate: true,
            deep: true,
            handler(newVal) {
                this.scope.value = newVal;
                if (!newVal) return;
                this.$nextTick(() => {
                    if (!(newVal instanceof Array) && !this.multiple) { //  单选
                        this.$refs.selectTree.setCurrentKey(newVal); // 设置默认选中
                        this.defaultExpandedKey = [newVal]; // 设置默认展开
                    } else { //  多选
                        this.$refs.selectTree.setCheckedKeys(newVal); // 设置默认选中
                        this.defaultExpandedKey = newVal; // 设置默认展开
                    }
                });
            }
        }
    },
    methods: {
        // 切换选项
        handleNodeClick(node, data) {
            const {value} = this.props;
            //  单选的情况下 非叶子节点是否可以选择
            if (!node.isLeaf || this.multiple) return;
            this.$emit('input', data[value]);
        },
        //  树checkbox选中
        handleCheck() {
            const pValue = this.props.value;
            //  数据处理
            let _dataList = this.getSimpleCheckedNodes(this.$refs.selectTree.store);
            this.$emit('input', _dataList.map(item => item = item[pValue]));
        },
        //  删除多选tag
        handleRemoveTag(value) {
            let _index = this.scope.value.indexOf(value);
            _index > -1 && this.scope.value.splice(_index, 1)
            this.$emit('input', this.scope.value);
        },
        // 清除选中
        clearHandle() {
            this.$emit('input', this.multiple ? [] : null);
        },
        /*
        * store  树的store
        * 如果所有子节点选中 则只传父节点id 子节点id删除
        * 如果父节点选中 取消某个子节点 则加上其他的子节点id 并删除父节点id
        * */
        getSimpleCheckedNodes(store) {
            const checkedNodes = [];
            const traverse = function(node) {
                const childNodes = node.root ? node.root.childNodes : node.childNodes;
                childNodes.forEach(child => {
                    if (child.checked) {
                        checkedNodes.push(child.data);
                    }
                    if (child.indeterminate) {
                        traverse(child);
                    }
                });
            };
            traverse(store)
            return checkedNodes;
        },
        //  下拉框出现/隐藏时触发
        visibleChange(status) {
          if (!status && this.multiple) this.defaultExpandedKey = this.scope.value;
        }
    }
};
</script>

<style lang="less">
  .el-tree-node__content{
    height: 34px;
  }
  .el-select-dropdown__item{
    padding: 0 5px;
    background-color: transparent !important;
  }
</style>
