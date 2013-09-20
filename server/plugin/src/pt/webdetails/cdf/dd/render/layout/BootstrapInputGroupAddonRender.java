/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

package pt.webdetails.cdf.dd.render.layout;

import org.apache.commons.jxpath.JXPathContext;

@SuppressWarnings("unchecked")
public class BootstrapInputGroupAddonRender extends DivRender {
  private String content;

  public BootstrapInputGroupAddonRender(JXPathContext context) {
    super(context);
  }

  @Override
  public void processProperties() {

    super.processProperties();
    
    content = getPropertyString("bootstrapText");

    getPropertyBag().addClass("input-group-addon");
  }



  @Override
  public String renderStart() {
    return "<span " + getPropertyBagString() + " >" + content;
  }


  @Override
  public String renderClose() {
    return "</span>";
  }
}
