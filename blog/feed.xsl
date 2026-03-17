<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:atom="http://www.w3.org/2005/Atom">
<xsl:output method="html" encoding="UTF-8" indent="yes"/>
<xsl:template match="/">
<html lang="tr">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title><xsl:value-of select="/rss/channel/title"/> — RSS</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{background:#16181C;color:#E8E6E2;font-family:Arial,Helvetica,sans-serif;line-height:1.6;padding:40px 20px}
.container{max-width:680px;margin:0 auto}
.header{border-bottom:1px solid rgba(232,230,226,0.10);padding-bottom:32px;margin-bottom:32px}
.header h1{font-family:Georgia,'Times New Roman',serif;font-size:24px;font-weight:400;margin-bottom:8px}
.header p{color:#8A8884;font-size:14px;margin-bottom:16px}
.rss-info{background:rgba(232,230,226,0.04);border:1px solid rgba(232,230,226,0.10);padding:16px 20px;font-size:13px;color:#8A8884;line-height:1.7}
.rss-info code{background:rgba(178,152,108,0.12);color:#B2986C;padding:2px 6px;font-size:12px;font-family:monospace;user-select:all}
.rss-info strong{color:#E8E6E2;font-weight:600}
.items{list-style:none}
.item{border-bottom:1px solid rgba(232,230,226,0.10);padding:20px 0}
.item:last-child{border-bottom:none}
.item-title{font-family:Georgia,'Times New Roman',serif;font-size:18px;font-weight:400}
.item-title a{color:#E8E6E2;text-decoration:none}
.item-title a:hover{color:#B2986C}
.item-date{font-size:11px;color:#8A8884;text-transform:uppercase;letter-spacing:0.08em;margin-top:6px}
.item-desc{font-size:14px;color:#8A8884;margin-top:8px}
.item-cat{display:inline-block;font-size:10px;text-transform:uppercase;letter-spacing:0.1em;color:#B2986C;border:1px solid rgba(178,152,108,0.3);padding:2px 8px;margin-top:8px}
.back{display:inline-block;margin-top:32px;font-size:13px;color:#B2986C;text-decoration:none;border:1px solid rgba(232,230,226,0.18);padding:6px 16px}
.back:hover{background:rgba(232,230,226,0.04)}
</style>
</head>
<body>
<div class="container">
<div class="header">
<h1><xsl:value-of select="/rss/channel/title"/></h1>
<p><xsl:value-of select="/rss/channel/description"/></p>
<div class="rss-info">
<strong>Bu bir RSS beslemesidir.</strong> Bu URL'yi RSS okuyucunuza ekleyerek yeni içeriklerden haberdar olabilirsiniz.<br/>
Bağlantı: <code>https://hexis.center/blog/feed.xml</code>
</div>
</div>
<ul class="items">
<xsl:for-each select="/rss/channel/item">
<li class="item">
<div class="item-title"><a><xsl:attribute name="href"><xsl:value-of select="link"/></xsl:attribute><xsl:value-of select="title"/></a></div>
<div class="item-date"><xsl:value-of select="pubDate"/></div>
<div class="item-desc"><xsl:value-of select="description"/></div>
<xsl:if test="category">
<span class="item-cat"><xsl:value-of select="category"/></span>
</xsl:if>
</li>
</xsl:for-each>
</ul>
<a href="/blog/" class="back">← Blog'a dön</a>
</div>
</body>
</html>
</xsl:template>
</xsl:stylesheet>
