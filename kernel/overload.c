#ifndef _LARGEFILE64_SOURCE
#define _LARGEFILE64_SOURCE
#endif

#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/init.h>
#include <linux/syscalls.h>
#include <linux/file.h>
#include <linux/fs.h>
#include <linux/string.h>
#include <linux/mm.h>
#include <linux/sched.h>
#include <linux/unistd.h>
#include <asm/pgtable.h>
#include <asm/uaccess.h>
#include <asm/ptrace.h>
#include <linux/utsname.h>
#include <linux/kallsyms.h>
#include <linux/limits.h>
#include <linux/ctype.h>

MODULE_LICENSE("GPL");

typedef void (*demo_sys_call_ptr_t)(void);
typedef asmlinkage long (*orig_openat_t)(struct pt_regs *regs);
typedef asmlinkage long (*orig_chdir_t)(struct pt_regs *regs);
typedef asmlinkage long (*orig_mkdir_t)(struct pt_regs *regs);
typedef asmlinkage long (*orig_symlinkat_t)(struct pt_regs *regs);
typedef asmlinkage long (*orig_linkat_t)(struct pt_regs *regs);
typedef asmlinkage long (*orig_rename_t)(struct pt_regs *regs);

void netlink_release(void);
void netlink_init(void);
int path_check(struct pt_regs *, char *);
demo_sys_call_ptr_t *get_sys_call_table(void);

demo_sys_call_ptr_t *sys_call_table = NULL;
orig_openat_t orig_openat = NULL;
orig_chdir_t orig_chdir = NULL;
orig_mkdir_t orig_mkdir = NULL;
orig_symlinkat_t orig_symlinkat = NULL;
orig_linkat_t orig_linkat = NULL;
orig_rename_t orig_rename = NULL;
unsigned int level;
pte_t *pte;

asmlinkage long overload_openat(struct pt_regs *regs)
{
	long sys_ret, safe_ret;
	char buffer[PATH_MAX];
	long nbytes;

	nbytes = strncpy_from_user(buffer, (char *)regs->si, PATH_MAX);

	safe_ret = path_check(regs, buffer);
	if (safe_ret == -1)
		return safe_ret;

	sys_ret = orig_openat(regs);
	return sys_ret;
}

asmlinkage long overload_chdir(struct pt_regs *regs)
{
	long sys_ret, safe_ret;
	char buffer[PATH_MAX];
	long nbytes;

	nbytes = strncpy_from_user(buffer, (char *)regs->di, PATH_MAX);
	safe_ret = path_check(regs, buffer);
	if (safe_ret == -1)
		return safe_ret;

	sys_ret = orig_chdir(regs);
	return sys_ret;
}

asmlinkage long overload_mkdir(struct pt_regs *regs)
{
	long sys_ret, safe_ret;
	char buffer[PATH_MAX];
	long nbytes;

	nbytes = strncpy_from_user(buffer, (char *)regs->di, PATH_MAX);
	safe_ret = path_check(regs, buffer);
	if (safe_ret == -1)
		return safe_ret;

	sys_ret = orig_mkdir(regs);
	return sys_ret;
}

asmlinkage long overload_symlinkat(struct pt_regs *regs)
{
	long sys_ret, safe_ret;
	char buffer[PATH_MAX];
	long nbytes;

	nbytes = strncpy_from_user(buffer, (char *)regs->di, PATH_MAX);
	safe_ret = path_check(regs, buffer);
	if (safe_ret == -1)
		return safe_ret;

	sys_ret = orig_symlinkat(regs);
	return sys_ret;
}

asmlinkage long overload_linkat(struct pt_regs *regs)
{
	long sys_ret, safe_ret;
	char buffer[PATH_MAX];
	long nbytes;

	nbytes = strncpy_from_user(buffer, (char *)regs->si, PATH_MAX);
	safe_ret = path_check(regs, buffer);
	if (safe_ret == -1)
		return safe_ret;

	sys_ret = orig_linkat(regs);
	return sys_ret;
}

asmlinkage long overload_rename(struct pt_regs *regs)
{
	long sys_ret, safe_ret;
	char buffer[PATH_MAX];
	long nbytes;

	nbytes = strncpy_from_user(buffer, (char *)regs->di, PATH_MAX);

	safe_ret = path_check(regs, buffer);
	if (safe_ret == -1)
		return safe_ret;

	sys_ret = orig_rename(regs);
	return sys_ret;
}

demo_sys_call_ptr_t *get_sys_call_table(void)
{
	demo_sys_call_ptr_t *_sys_call_table = NULL;

	_sys_call_table = (demo_sys_call_ptr_t *)kallsyms_lookup_name("sys_call_table");

	return _sys_call_table;
}

static int __init vault_init(void)
{
	sys_call_table = get_sys_call_table();
	printk("Info: sys_call_table found at %lx\n", (unsigned long)sys_call_table);

	orig_openat = (orig_openat_t)sys_call_table[__NR_openat];
	orig_chdir = (orig_chdir_t)sys_call_table[__NR_chdir];
	orig_mkdir = (orig_mkdir_t)sys_call_table[__NR_mkdir];
	orig_symlinkat = (orig_symlinkat_t)sys_call_table[__NR_symlinkat];
	orig_linkat = (orig_linkat_t)sys_call_table[__NR_linkat];
	orig_rename = (orig_rename_t)sys_call_table[__NR_rename];

	printk("Info: sys_openat: %lx; sys_chdir: %lx; sys_mkdir: %lx; sys_symlinkat: %lx; sys_linkat: %lx;; sys_rename: %lx;\n",
		   (long)orig_openat, (long)orig_chdir, (long)orig_mkdir, (long)orig_symlinkat, (long)orig_linkat, (long)orig_rename);

	pte = lookup_address((unsigned long)sys_call_table, &level);
	set_pte_atomic(pte, pte_mkwrite(*pte));
	printk("Info: Disable write-protection of page with sys_call_table\n");

	sys_call_table[__NR_openat] = (demo_sys_call_ptr_t)overload_openat;
	sys_call_table[__NR_chdir] = (demo_sys_call_ptr_t)overload_chdir;
	sys_call_table[__NR_mkdir] = (demo_sys_call_ptr_t)overload_mkdir;
	sys_call_table[__NR_symlinkat] = (demo_sys_call_ptr_t)overload_symlinkat;
	sys_call_table[__NR_linkat] = (demo_sys_call_ptr_t)overload_linkat;
	sys_call_table[__NR_rename] = (demo_sys_call_ptr_t)overload_rename;
	set_pte_atomic(pte, pte_clear_flags(*pte, _PAGE_RW));

	netlink_init();
	return 0;
}

static void __exit vault_exit(void)
{
	pte = lookup_address((unsigned long)sys_call_table, &level);
	set_pte_atomic(pte, pte_mkwrite(*pte));

	sys_call_table[__NR_openat] = (demo_sys_call_ptr_t)orig_openat;
	sys_call_table[__NR_chdir] = (demo_sys_call_ptr_t)orig_chdir;
	sys_call_table[__NR_mkdir] = (demo_sys_call_ptr_t)orig_mkdir;
	sys_call_table[__NR_symlinkat] = (demo_sys_call_ptr_t)orig_symlinkat;
	sys_call_table[__NR_linkat] = (demo_sys_call_ptr_t)orig_linkat;
	sys_call_table[__NR_rename] = (demo_sys_call_ptr_t)orig_rename;
	set_pte_atomic(pte, pte_clear_flags(*pte, _PAGE_RW));

	netlink_release();
	printk("Info: successfully exit!\n");
}

module_init(vault_init);
module_exit(vault_exit);
