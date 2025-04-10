<?php
/**
 * model.class.php 数据模型基类
 *
 * @copyright (C) 2005-2014 LEYUN360 Inc.
 * @license This is a charge software, licensing terms
 * @lastmodify 2010-12-16
 * $Id: model.class.php 2 2010-12-16 10:59:13Z LEYUN360 $
 */
base :: load_sys_class('db_factory', '', 0);
class model {
	// 数据库配置
	protected $db_config = '';
	// 数据库连接
	protected $db = '';
	// 调用数据库的配置项
	protected $db_setting = 'default';
	// 数据表名
	protected $table_name = '';
	// 表前缀
	public $db_tablepre = '';

	public function __construct() {
		if (!isset($this -> db_config[$this -> db_setting])) {
			$this -> db_setting = 'default';
		}
		$this -> table_name = $this -> db_config[$this -> db_setting]['tablepre'] . $this -> table_name;
		$this -> db_tablepre = $this -> db_config[$this -> db_setting]['tablepre'];
		$this -> db = db_factory :: get_instance($this -> db_config) -> get_database($this -> db_setting);
	}

	/**
	 * 执行sql查询
	 *
	 * @param  $where 查询条件[例`name`='$name']
	 * @param  $data 需要查询的字段值[例`name`,`gender`,`birthday`]
	 * @param  $limit 返回结果范围[例：10或10,10 默认为空]
	 * @param  $order 排序方式	[默认按数据库默认方式排序]
	 * @param  $group 分组方式	[默认为空]
	 * @return array 查询结果集数组
	 */
	final public function select($where = '', $data = '*', $limit = '', $order = '', $group = '', $key = '') {
		if (is_array($where)) $where = $this -> sqls($where);
		return $this -> db -> select($data, $this -> table_name, $where, $limit, $order, $group, $key);
	}

	/**
	 * 查询多条数据并分页
	 *
	 * @param  $where
	 * @param  $order
	 * @param  $page
	 * @param  $pagesize
	 * @return unknown_type
	 */
	final public function listinfo($where = '', $order = '', $page = 1, $pagesize = 20, $pageshow = 1, $setpages = 10, $arrpage = 1, $key = '', $urlrule = '', $array = array()) {
		$where = $this -> sqls($where);
		$this -> number = $this -> count($where);
		$this -> maxpage = ceil($this -> number / $pagesize);
		$page = max(intval($page), 1);
		$offset = $pagesize * ($page-1);
		if ($pageshow) $this -> pages = pages($this -> number, $page, $pagesize, $urlrule, $array, $setpages, $arrpage); //是否显示分页
		$array = array();
		return $this -> select($where, '*', "$offset, $pagesize", $order, '', $key);
	}

	/**
	 * 获取单条记录查询
	 *
	 * @param  $where 查询条件
	 * @param  $data 需要查询的字段值[例`name`,`gender`,`birthday`]
	 * @param  $order 排序方式	[默认按数据库默认方式排序]
	 * @param  $group 分组方式	[默认为空]
	 * @return array /null	数据查询结果集,如果不存在，则返回空
	 */
	final public function get_one($where = '', $data = '*', $order = '', $group = '') {
		if (is_array($where)) $where = $this -> sqls($where);
		return $this -> db -> get_one($data, $this -> table_name, $where, $order, $group);
	}

	/**
	 * 直接执行sql查询
	 *
	 * @param  $sql 查询sql语句
	 * @param  $r 是否返回结果集
	 * @return boolean /query resource		如果为查询语句，返回资源句柄，否则返回true/false
	 */
	final public function query($sql, $r = false) {
		//设置SQL语句，会自动把SQL语句里的#@__替换为$this->db_tablepre(在配置文件中为tablepre)
		$sql = str_replace('#@__', $this -> db_tablepre, $sql);
		return $this -> db -> query($sql, $r);
	}

	/**
	 * 直接执行sql查询
	 *
	 * @param  $sql 查询sql语句
	 * @param  $r 是否返回结果集
	 * @return boolean /query resource		如果为查询语句，返回资源句柄，否则返回true/false
	 */
	final public function querys($sql, $r = false) {
		//设置SQL语句，会自动把SQL语句里的#@__替换为$this->db_tablepre(在配置文件中为tablepre)
		$sql = str_replace('#@__', $this -> db_tablepre, $sql);
		return $this -> db -> querys($sql, $r);
	}

	/**
	 * 执行添加记录操作
	 *
	 * @param  $data 要增加的数据，参数为数组。数组key为字段值，数组值为数据取值
	 * @param  $return_insert_id 是否返回新建ID号
	 * @param  $replace 是否采用 replace into的方式添加数据
	 * @return boolean
	 */
	final public function insert($data, $return_insert_id = false, $replace = false, $field = '') {
		return $this -> db -> insert($data, $this -> table_name, $return_insert_id, $replace, $field);
	}

	/**
	 * 获取最后一次添加记录的主键号
	 *
	 * @return int
	 */
	final public function insert_id() {
		return $this -> db -> insert_id();
	}

	/**
	 * 执行更新记录操作
	 *
	 * @param  $data 要更新的数据内容，参数可以为数组也可以为字符串，建议数组。
						为数组时数组key为字段值，数组值为数据取值
						为字符串时[例：`name`='MYSMS',`hits`=`hits`+1]。
						为数组时[例: array('name'=>'MYSMS','password'=>'123456')]
	 * 						数组的另一种使用array('name'=>'+=1', 'base'=>'-=1');程序会自动解析为`name` = `name` + 1, `base` = `base` - 1
	 * @param  $where 更新数据时的条件,可为数组或字符串
	 * @return boolean
	 */
	final public function update($data, $where = '') {
		if (is_array($where)) $where = $this -> sqls($where);
		return $this -> db -> update($data, $this -> table_name, $where);
	}

	/**
	 * 执行删除记录操作
	 *
	 * @param  $where 删除数据条件,不充许为空。
	 * @return boolean
	 */
	final public function delete($where) {
		if (is_array($where)) $where = $this -> sqls($where);
		return $this -> db -> delete($this -> table_name, $where);
	}

	/**
	 * 计算记录数
	 *
	 * @param string $ /array $where 查询条件
	 */
	final public function count($where = '') {
		$r = $this -> get_one($where, "COUNT(*) AS num");
		return $r['num'];
	}

	/**
	 * 将数组转换为SQL语句，如果传入$in_cloumn 生成格式为 IN('a', 'b', 'c')
	 *
	 * @param  $where 条件数组或者字符串
	 * @param  $front 连接符
	 * @param  $in_column 字段名称
	 * @return string
	 */
	final public function sqls($where, $front = ' AND ', $in_column = false) {
		if ($in_column && is_array($where)) {
			$ids = '\'' . implode('\',\'', $where) . '\'';
			$sql = "$in_column IN ($ids)";
			return $sql;
		} else {
			if (is_array($where) && count($where) > 0) {
				$sql = '';
				foreach ($where as $key => $val) {
					$sql .= $sql ? " $front `$key` = '$val' " : " `$key` = '$val' ";
				}
				return $sql;
			} else {
				return $where;
			}
		}
	}

	/**
	 * 获取最后数据库操作影响到的条数
	 *
	 * @return int
	 */
	final public function affected_rows() {
		return $this -> db -> affected_rows();
	}

	/**
	 * 获取数据表主键
	 *
	 * @return array
	 */
	final public function get_primary() {
		return $this -> db -> get_primary($this -> table_name);
	}

	/**
	 * 获取表字段
	 *
	 * @return array
	 */
	final public function get_fields() {
		return $this -> db -> get_fields($this -> table_name);
	}

	/**
	 * 检查表是否存在
	 *
	 * @param  $table 表名
	 * @return boolean
	 */
	final public function table_exists($table) {
		return $this -> db -> table_exists($this -> db_tablepre . $table);
	}

	final public function list_tables() {
		return $this -> db -> list_tables();
	}
	/**
	 * 返回数据结果集
	 *
	 * @param  $query （mysql_query返回值）
	 * @return array
	 */
	final public function fetch_array() {
		$data = array();
		while ($r = $this -> db -> fetch_next()) {
			$data[] = $r;
		}
		return $data;
	}

	/**
	 * 返回数据库版本号
	 */
	final public function version() {
		return $this -> db -> version();
	}
}
