#ifndef _LARGEFILE64_SOURCE
#define _LARGEFILE64_SOURCE
#endif

#include <linux/kernel.h>
#include <linux/module.h>
#include <linux/syscalls.h>
#include <linux/file.h>
#include <linux/unistd.h>

/*
** module macros
*/
MODULE_LICENSE("GPL");
MODULE_AUTHOR("Emison");
MODULE_DESCRIPTION("overload sys_call_table");

typedef void (*sys_call_ptr_t)(void);
typedef asmlinkage ssize_t (*orig_syscall_t)(struct pt_regs *regs);

orig_syscall_t orig_read = NULL;
sys_call_ptr_t *sys_call_table = NULL;

unsigned int level = 0;
pte_t *pte = NULL;

asmlinkage ssize_t overload_read(struct pt_regs *regs)
{
    printk("You are a pig!");
    ssize_t ret = orig_read(regs);
    return ret;
}

static sys_call_ptr_t *get_sys_call_table(void)
{
    sys_call_ptr_t *_sys_call_table = NULL;

    _sys_call_table = (sys_call_ptr_t *)kallsyms_lookup_name("sys_call_table");

    return _sys_call_table;
}

static int __init overload_init(void)
{
    sys_call_table = get_sys_call_table();

    orig_read = (orig_syscall_t)sys_call_table[__NR_read];

    pte = lookup_address((unsigned long)sys_call_table, &level);

    set_pte_atomic(pte, pte_mkwrite(*pte));

    sys_call_table[__NR_read] = (sys_call_ptr_t)overload_read;

    set_pte_atomic(pte, pte_clear_flags(*pte, _PAGE_RW));

    return 0;
}

/**
 * @brief 释放内核模块，恢复原系统调用
 *
 */
static void __exit overload_exit(void)
{
    set_pte_atomic(pte, pte_mkwrite(*pte));

    sys_call_table[__NR_read] = (sys_call_ptr_t)orig_read;

    set_pte_atomic(pte, pte_clear_flags(*pte, _PAGE_RW));
}

module_init(overload_init);
module_exit(overload_exit);
