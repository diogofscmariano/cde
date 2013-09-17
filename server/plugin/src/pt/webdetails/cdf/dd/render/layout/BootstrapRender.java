/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

package pt.webdetails.cdf.dd.render.layout;

import org.apache.commons.jxpath.JXPathContext;

@SuppressWarnings("unchecked")
public class BootstrapRender extends DivRender {

  private String componentType;

  public BootstrapRender(JXPathContext context) {
    super(context);
  }

  @Override
  public void processProperties() {

    super.processProperties();

    componentType = getPropertyString("componentType");
    getPropertyBag().addColClass("btn", true);
  }



  @Override
  public String renderStart() {
    String content = "";
    if(componentType.equals("button")){
      content = "<button type='button'" + getPropertyBagString() + ">";
    } else if(componentType.equals("input")){
      content = "<input " + getPropertyBagString() + ">";
    } else if(componentType.equals("dropdown")){
      content = "<ul" + getPropertyBagString() + ">";
    }
    return content;
  }


  @Override
  public String renderClose() {
    if(componentType.equals("button")){
      return "</button>";
    } else if(componentType.equals("input")){
      return "</input>";
    } else if(componentType.equals("dropdown")){
      return "</ul>";
    }

    return "</div>";
  }
}
