/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

package pt.webdetails.cdf.dd.model.inst.writer.cdfrunjs.components;

import org.apache.commons.lang.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.json.JSONArray;
import org.json.JSONException;
import pt.webdetails.cdf.dd.DashboardManager;
import pt.webdetails.cdf.dd.model.core.Thing;
import pt.webdetails.cdf.dd.model.core.writer.IThingWriteContext;
import pt.webdetails.cdf.dd.model.core.writer.IThingWriter;
import pt.webdetails.cdf.dd.model.core.writer.ThingWriteException;
import pt.webdetails.cdf.dd.model.core.writer.js.JsWriterAbstract;
import pt.webdetails.cdf.dd.model.inst.Component;
import pt.webdetails.cdf.dd.model.inst.PropertyBinding;
import pt.webdetails.cdf.dd.model.inst.WidgetComponent;
import pt.webdetails.cdf.dd.model.inst.writer.cdfrunjs.dashboard.CdfRunJsDashboardWriteContext;
import pt.webdetails.cdf.dd.model.inst.writer.cdfrunjs.dashboard.CdfRunJsDashboardWriteOptions;
import pt.webdetails.cdf.dd.model.inst.writer.cdfrunjs.dashboard.CdfRunJsDashboardWriteResult;
import pt.webdetails.cdf.dd.util.JsonUtils;

/**
 * @author dcleao
 */
public class CdfRunRequireJsWidgetComponentWriter extends JsWriterAbstract implements IThingWriter
{
  private static final Log _logger = LogFactory.getLog(CdfRunRequireJsWidgetComponentWriter.class);
  
  public void write(Object output, IThingWriteContext context, Thing t) throws ThingWriteException
  {
    this.write((StringBuilder)output, (CdfRunJsDashboardWriteContext)context, (WidgetComponent)t);
  }
  
  public void write(StringBuilder out, CdfRunJsDashboardWriteContext context, WidgetComponent comp) throws ThingWriteException
  {
    //WidgetComponentType compType = comp.getMeta();
    DashboardManager dashMgr = DashboardManager.getInstance();
    
    CdfRunJsDashboardWriteOptions options = context.getOptions()
            .addAliasPrefix(comp.getName()); // <-- NOTE:!
    
    String newAliasPrefix = options.getAliasPrefix();
    
    CdfRunJsDashboardWriteResult dashResult = dashMgr.getDashboardCdfRunJs(
          comp.getWcdfPath(), 
          options, 
          context.isBypassCacheRead());
    
    out.append(dashResult.getComponents());
    
    // wrapJsScriptTags(out, 
    this.writeParameters(out, comp, newAliasPrefix);
  }
  
  private void writeParameters(
          StringBuilder out, 
          WidgetComponent comp, 
          String aliasPrefix)
  {
    if(comp.getPropertyBindingCount() > 0)
    {
      Iterable<PropertyBinding> props = comp.getPropertyBindings();
      for(PropertyBinding prop : props)
      {
        if("parameters".equalsIgnoreCase(prop.getAlias()) || 
           "xActionArrayParameter".equalsIgnoreCase(prop.getName())) // legacy way
        {
          String paramsAssocList = prop.getValue();
          if(StringUtils.isNotEmpty(paramsAssocList))
          {
            this.writeParametersAssocList(out, paramsAssocList, aliasPrefix);
          }
        }
        else if("parameter".equalsIgnoreCase(prop.getInputType()))
        {
          // TODO: What a weak test... to detect a parameter property?
          writeJsSyncParameter(out, prop.getAlias(), prop.getValue(), aliasPrefix);
        }
      }
    }
  }
  
  private void writeParametersAssocList(
          StringBuilder out,
          String paramsAssocList, 
          String aliasPrefix)
  {
    try
    {
      JSONArray params = new JSONArray(paramsAssocList);
      for(int i = 0, L = params.length() ; i < L ; i++)
      {
        JSONArray line = params.getJSONArray(i);
        // [ widgetProp, outerDashParamName ]
        
        // TODO: FIXME:  Don't know why but in the old code,
        // only association lists wrapped the value in a parameter tag.
        // This might be a problem, if the value is already wrapped...
        String dashParam = "${p:" + line.getString(1) + "}";
        writeJsSyncParameter(out, line.getString(0), dashParam, aliasPrefix);
      }
    }
    catch (JSONException ex)
    {
      _logger.error("Could not write widget parameters in association list", ex);
    }
  }
  
  private void writeJsSyncParameter(
          StringBuilder out, 
          String widgetLocalProp,
          String dashParam,
          String aliasPrefix)
  {
    String widgetProp = Component.composeIds(aliasPrefix, widgetLocalProp);

    out.append("dashboard.syncParametersOnInit(");
    out.append(JsonUtils.toJsString(dashParam));
    out.append(", ");
    out.append(JsonUtils.toJsString(widgetProp));
    out.append(");");
  }
}