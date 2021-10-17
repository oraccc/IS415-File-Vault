CONFIG_MODULE_SIG=n
CONFIG_MODULE_SIG_ALL=n
obj-m += fileVault.o
fileVault-objs := overload.o
KDIR := /lib/modules/$(shell uname -r)/build
PWD := $(shell pwd)
default:
	$(MAKE) -C $(KDIR) M=$(PWD) modules
clean:
	$(RM) -rf .*.cmd *.mod *.mod.c *.o *.ko .tmp* *.order *.symvers *.ur-safe *.dwo
