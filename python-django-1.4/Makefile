
include $(TOPDIR)/rules.mk

PKG_NAME:=python-django-1.4
PKG_VERSION:=1.4.14
PKG_RELEASE:=1

PKG_SOURCE:=Django-$(PKG_VERSION).tar.gz
PKG_SOURCE_URL:=https://pypi.python.org/packages/source/D/Django/
PKG_MD5SUM:=80dc1b9866487afc2ab3f774e29181bc

PKG_BUILD_DIR:=$(BUILD_DIR)/Django-$(PKG_VERSION)
PKG_BUILD_DEPENDS:=python

include $(INCLUDE_DIR)/package.mk
$(call include_mk, python-package.mk)

define Package/python-django-1.4
  SECTION:=language-python
  CATEGORY:=Languages
  SUBMENU:=Python
  TITLE:=Django Web framework v1.4
  URL:=https://www.djangoproject.com/
  DEPENDS:=+python
endef

define Package/python-django-1.4/description
 Django is a high-level Python Web framework that encourages rapid
 development and clean, pragmatic design.
endef

define Build/Compile
	$(call Build/Compile/PyMod,., \
		install --prefix="/usr" --root="$(PKG_INSTALL_DIR)" \
	)
endef

define Package/python-django-1.4/install
	$(INSTALL_DIR) $(1)$(PYTHON_PKG_DIR)
	$(CP) \
		$(PKG_INSTALL_DIR)$(PYTHON_PKG_DIR)/* \
		$(1)$(PYTHON_PKG_DIR)/
endef

$(eval $(call BuildPackage,python-django-1.4))
