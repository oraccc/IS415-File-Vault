#include <linux/string.h>
#include <linux/mm.h>
#include <net/sock.h>
#include <net/netlink.h>
#include <linux/sched.h>
#include <linux/fs_struct.h>
#include <linux/limits.h>

#define NETLINK_VAULT 29

struct sock *nl_sk = NULL;
u32 recv_pid = 0;

int netlink_sendmsg(const void *buffer, unsigned int size)
{
	struct sk_buff *skb;
	struct nlmsghdr *nlh;
	int len = NLMSG_SPACE(1200);
	if ((!buffer) || (!nl_sk) || (recv_pid == 0))
		return 1;
	skb = alloc_skb(len, GFP_ATOMIC);
	if (!skb)
	{
		printk(KERN_ERR "net_link: allocat_skb failed.\n");
		return 1;
	}
	nlh = nlmsg_put(skb, 0, 0, 0, 1200, 0);
	NETLINK_CB(skb).creds.pid = 0;
	memcpy(NLMSG_DATA(nlh), buffer, size);

	if (netlink_unicast(nl_sk, skb, recv_pid, MSG_DONTWAIT) < 0)
	{
		printk(KERN_ERR "net_link: can not unicast skb \n");
		return 1;
	}
	return 0;
}

void nl_recv_pid(struct sk_buff *skb)
{
	struct nlmsghdr *nlh;
	printk(KERN_INFO "Entering: %s\n", __FUNCTION__);

	nlh = (struct nlmsghdr *)skb->data;
	recv_pid = nlh->nlmsg_pid;
	printk(KERN_INFO "Netlink received pid %d\n", recv_pid);
}

void netlink_init(void)
{
	struct netlink_kernel_cfg cfg =
		{
			.input = nl_recv_pid,
		};

	nl_sk = netlink_kernel_create(&init_net, NETLINK_VAULT, &cfg);

	if (!nl_sk)
	{
		printk(KERN_ERR "net_link: Cannot create netlink socket.\n");
		if (nl_sk != NULL)
			sock_release(nl_sk->sk_socket);
	}
	else
		printk("net_link: create socket ok.\n");
}

void netlink_release(void)
{
	if (nl_sk != NULL)
		sock_release(nl_sk->sk_socket);
}
