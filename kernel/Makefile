obj-m := VaultModule.o
VaultModule-objs := check.o netlinkp.o overload.o
KDIR := /lib/modules/$(shell uname -r)/build
PWD := $(shell pwd)
default:
	$(MAKE) -C $(KDIR) SUBDIRS=$(PWD) modules
clean:
	$(RM) -rf .*.cmd *.mod.c *.o *.ko .tmp* modules.order Module.symvers overload.o.ur-safe