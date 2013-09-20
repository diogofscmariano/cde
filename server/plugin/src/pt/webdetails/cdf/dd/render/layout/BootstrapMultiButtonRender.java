/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

package pt.webdetails.cdf.dd.render.layout;

import org.apache.commons.jxpath.JXPathContext;

@SuppressWarnings("unchecked")
public class BootstrapMultiButtonRender extends DivRender {

  public BootstrapMultiButtonRender(JXPathContext context) {
    super(context);
  }

  @Override
  public void processProperties() {

    super.processProperties();
    String orientation = getPropertyString("bootstrapOrientation");
    if(!orientation.isEmpty()){
      getPropertyBag().addClass(orientation);
    } else {
      getPropertyBag().addClass("btn-group");
    }

    getPropertyBag().addClass(getPropertyString("boostrapSize"));
  }



  @Override
  public String renderStart() {
    return "<div " + getPropertyBagString() + ">";
  }


  @Override
  public String renderClose() {
    return "</div>";
  }
}
