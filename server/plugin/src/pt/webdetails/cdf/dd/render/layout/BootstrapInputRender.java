/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

package pt.webdetails.cdf.dd.render.layout;

import org.apache.commons.jxpath.JXPathContext;

@SuppressWarnings("unchecked")
public class BootstrapInputRender extends DivRender {
  private String initialContent;
  private String type;

  public BootstrapInputRender(JXPathContext context) {
    super(context);
  }

  @Override
  public void processProperties() {

    super.processProperties();
    initialContent = getPropertyString("bootstrapInitialContent");
    type = getPropertyString("bootstrapInputType");
    getPropertyBag().addClass("form-control");
  }



  @Override
  public String renderStart() {
    return "<input type='" + type + "' placeholder='" + initialContent + "' " + getPropertyBagString() + ">";
  }


  @Override
  public String renderClose() {
    return "</input>";
  }
}
