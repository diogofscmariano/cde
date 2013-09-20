/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

package pt.webdetails.cdf.dd.render.layout;

import org.apache.commons.jxpath.JXPathContext;

@SuppressWarnings("unchecked")
public class BootstrapButtonRender extends DivRender {

  private String content;

  public BootstrapButtonRender(JXPathContext context) {
    super(context);
  }

  @Override
  public void processProperties() {

    super.processProperties();
    content = getPropertyString("bootstrapText");


    getPropertyBag().addClass(getPropertyString("bootstrapStyle"));
    getPropertyBag().addClass("btn");
  }



  @Override
  public String renderStart() {
    return "<button type='button' " + getPropertyBagString() + " content='" + content + "'>"+content;
  }


  @Override
  public String renderClose() {
    return "</button>";
  }
}
